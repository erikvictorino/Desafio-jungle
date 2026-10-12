import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

// Importando as entidades que serão utilizadas pelo módulo de carteira
import { Wallet } from './wallet.entity.js';
import { LedgerEntry } from './entities/ledger-entry.entity.js';
import { WagerTransaction } from '../wagering/entities/wager-transaction.entity.js';

// Importando o serviço e o controller da carteira
import { WalletService } from './wallet.service.js';
import { WalletController } from './wallet.controller.js';

@Module({
  // Registrando as entidades para permitir a injeção de seus repositórios
  imports: [
    MikroOrmModule.forFeature([
      Wallet, // Entidade responsável pelos dados da carteira
      LedgerEntry, // Entidade responsável pelo histórico de movimentações
      WagerTransaction, // Entidade responsável pelas transações de apostas
    ]),
  ],

  // Registrando o serviço que contém a lógica de negócio da carteira
  providers: [WalletService],

  // Registrando as rotas HTTP relacionadas à carteira
  controllers: [WalletController],

  // Permitindo que outros módulos utilizem o serviço da carteira
  exports: [WalletService],
})
export class WalletModule {}