import { defineConfig } from '@mikro-orm/postgresql';
import 'dotenv/config';
import { Wallet } from './wallet/wallet.entity.js';
import { LedgerEntry } from './wallet/entities/ledger-entry.entity.js';
import { WagerTransaction } from './wagering/entities/wager-transaction.entity.js';
export default defineConfig({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER ?? 'jungle',
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME ?? 'jungle_gaming',
    entities: [Wallet, LedgerEntry, WagerTransaction],
    entitiesTs: [Wallet, LedgerEntry, WagerTransaction],
    migrations: {
        path: './dist/migrations',
        pathTs: './src/migrations',
        glob: '!(*.d).{js,ts}',
    },
});
//# sourceMappingURL=mikro-orm.config.js.map