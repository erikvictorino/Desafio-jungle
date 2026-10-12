import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager, LockMode } from '@mikro-orm/postgresql';
import { createHash } from 'node:crypto';
import { Decimal } from 'decimal.js';

import { Wallet } from './wallet.entity.js';
import { LedgerEntry } from './entities/ledger-entry.entity.js';
import {
  WagerTransaction,
  TransactionKind,
  TransactionStatus,
} from '../wagering/entities/wager-transaction.entity.js';

export interface CreateBetInput {
  providerId: string;
  externalTransactionId: string;
  playerId: string;
  currency: string;
  amount: string;
  roundId: string;
  gameId: string;
  idempotencyKey: string;
}

@Injectable()
export class WalletService {
  constructor(private readonly em: EntityManager) {}

  async createBet(input: CreateBetInput) {
    // Validando os campos obrigatórios.
    const campos = [
      input.providerId,
      input.externalTransactionId,
      input.playerId,
      input.currency,
      input.roundId,
      input.gameId,
      input.idempotencyKey,
    ];

    if (
      campos.some(
        (campo) => typeof campo !== 'string' || !campo.trim(),
      ) ||
      typeof input.amount !== 'string' ||
      !/^[A-Z]{3}$/.test(input.currency) ||
      !/^\d+(\.\d{1,2})?$/.test(input.amount)
    ) {
      throw new ConflictException('Dados da aposta inválidos');
    }

    const amount = new Decimal(input.amount);

    if (!amount.isFinite() || amount.lte(0)) {
      throw new ConflictException(
        'O valor da aposta deve ser positivo',
      );
    }

    const amountString = amount.toFixed(2);

    // Criando uma impressão digital dos dados da solicitação.
    const requestHash = createHash('sha256')
      .update(
        JSON.stringify({
          providerId: input.providerId,
          externalTransactionId: input.externalTransactionId,
          playerId: input.playerId,
          currency: input.currency,
          amount: amountString,
          roundId: input.roundId,
          gameId: input.gameId,
        }),
      )
      .digest('hex');

    // Todas as alterações financeiras acontecem na mesma transação.
    return this.em.transactional(async (tx) => {
      // Impedindo o processamento duplicado da mesma transação.
      const existente = await tx.findOne(WagerTransaction, {
        providerId: input.providerId,
        externalTransactionId: input.externalTransactionId,
      });

      if (existente) {
        if (
          existente.requestHash !== requestHash ||
          existente.idempotencyKey !== input.idempotencyKey
        ) {
          throw new ConflictException(
            'A transação já existe com dados diferentes',
          );
        }

        return {
          transactionId: existente.id,
          status: existente.status,
          replayed: true,
        };
      }

      // Bloqueando a carteira para evitar débitos concorrentes.
      const wallet = await tx.findOne(
        Wallet,
        {
          playerId: input.playerId,
          currency: input.currency,
        },
        { lockMode: LockMode.PESSIMISTIC_WRITE },
      );

      if (!wallet) {
        throw new NotFoundException('Carteira não encontrada');
      }

      const balanceBefore = new Decimal(wallet.balance);

      // Registrando a aposta recusada sem debitar a carteira.
      if (balanceBefore.lt(amount)) {
        const rejeitada = tx.create(WagerTransaction, {
          providerId: input.providerId,
          externalTransactionId: input.externalTransactionId,
          idempotencyKey: input.idempotencyKey,
          requestHash,
          playerId: input.playerId,
          walletId: wallet.id,
          roundId: input.roundId,
          gameId: input.gameId,
          kind: TransactionKind.BET,
          amount: amountString,
          status: TransactionStatus.REJECTED,
          createdAt: new Date(),
        });

        tx.persist(rejeitada);
        await tx.flush();

        return {
          transactionId: rejeitada.id,
          status: rejeitada.status,
          balance: balanceBefore.toFixed(2),
          message: 'Saldo insuficiente',
        };
      }

      const balanceAfter = balanceBefore.minus(amount);

      // Criando o registro da aposta.
      const transaction = tx.create(WagerTransaction, {
        providerId: input.providerId,
        externalTransactionId: input.externalTransactionId,
        idempotencyKey: input.idempotencyKey,
        requestHash,
        playerId: input.playerId,
        walletId: wallet.id,
        roundId: input.roundId,
        gameId: input.gameId,
        kind: TransactionKind.BET,
        amount: amountString,
        status: TransactionStatus.PROCESSED,
        createdAt: new Date(),
      });

      tx.persist(transaction);
      await tx.flush();

      // Atualizando o saldo da carteira.
      wallet.balance = balanceAfter.toFixed(2);
      wallet.version += 1;
      wallet.updatedAt = new Date();

      // Registrando o histórico financeiro do débito.
      const ledger = tx.create(LedgerEntry, {
        walletId: wallet.id,
        transactionId: transaction.id,
        direction: 'DEBIT',
        amount: amountString,
        balanceBefore: balanceBefore.toFixed(2),
        balanceAfter: balanceAfter.toFixed(2),
        createdAt: new Date(),
      });

      tx.persist(ledger);
      await tx.flush();

      return {
        transactionId: transaction.id,
        status: transaction.status,
        balance: balanceAfter.toFixed(2),
        replayed: false,
      };
    });
  }
}