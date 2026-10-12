import { defineConfig } from '@mikro-orm/postgresql';
import 'dotenv/config';

// Importando as entidades explicitamente para evitar falhas na descoberta
import { Wallet } from './wallet/wallet.entity.js';
import { LedgerEntry } from './wallet/entities/ledger-entry.entity.js';
import { WagerTransaction } from './wagering/entities/wager-transaction.entity.js';

export default defineConfig({
  // Configurações de conexão com o PostgreSQL
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER ?? 'jungle',
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME ?? 'jungle_gaming',

  // Entidades usadas pela aplicação
  entities: [Wallet, LedgerEntry, WagerTransaction],
  entitiesTs: [Wallet, LedgerEntry, WagerTransaction],

  // Configuração das migrações
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
    glob: '!(*.d).{js,ts}',
  },
});