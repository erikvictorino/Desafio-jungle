var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ConflictException, Injectable, NotFoundException, } from '@nestjs/common';
import { EntityManager, LockMode } from '@mikro-orm/postgresql';
import { createHash } from 'node:crypto';
import { Decimal } from 'decimal.js';
import { Wallet } from './wallet.entity.js';
import { LedgerEntry } from './entities/ledger-entry.entity.js';
import { WagerTransaction, TransactionKind, TransactionStatus, } from '../wagering/entities/wager-transaction.entity.js';
let WalletService = class WalletService {
    em;
    constructor(em) {
        this.em = em;
    }
    async createBet(input) {
        const campos = [
            input.providerId,
            input.externalTransactionId,
            input.playerId,
            input.currency,
            input.roundId,
            input.gameId,
            input.idempotencyKey,
        ];
        if (campos.some((campo) => typeof campo !== 'string' || !campo.trim()) ||
            typeof input.amount !== 'string' ||
            !/^[A-Z]{3}$/.test(input.currency) ||
            !/^\d+(\.\d{1,2})?$/.test(input.amount)) {
            throw new ConflictException('Dados da aposta inválidos');
        }
        const amount = new Decimal(input.amount);
        if (!amount.isFinite() || amount.lte(0)) {
            throw new ConflictException('O valor da aposta deve ser positivo');
        }
        const amountString = amount.toFixed(2);
        const requestHash = createHash('sha256')
            .update(JSON.stringify({
            providerId: input.providerId,
            externalTransactionId: input.externalTransactionId,
            playerId: input.playerId,
            currency: input.currency,
            amount: amountString,
            roundId: input.roundId,
            gameId: input.gameId,
        }))
            .digest('hex');
        return this.em.transactional(async (tx) => {
            const existente = await tx.findOne(WagerTransaction, {
                providerId: input.providerId,
                externalTransactionId: input.externalTransactionId,
            });
            if (existente) {
                if (existente.requestHash !== requestHash ||
                    existente.idempotencyKey !== input.idempotencyKey) {
                    throw new ConflictException('A transação já existe com dados diferentes');
                }
                return {
                    transactionId: existente.id,
                    status: existente.status,
                    replayed: true,
                };
            }
            const wallet = await tx.findOne(Wallet, {
                playerId: input.playerId,
                currency: input.currency,
            }, { lockMode: LockMode.PESSIMISTIC_WRITE });
            if (!wallet) {
                throw new NotFoundException('Carteira não encontrada');
            }
            const balanceBefore = new Decimal(wallet.balance);
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
            wallet.balance = balanceAfter.toFixed(2);
            wallet.version += 1;
            wallet.updatedAt = new Date();
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
};
WalletService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [EntityManager])
], WalletService);
export { WalletService };
//# sourceMappingURL=wallet.service.js.map