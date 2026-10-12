import 'dotenv/config';
import { Wallet } from './wallet/wallet.entity.js';
import { LedgerEntry } from './wallet/entities/ledger-entry.entity.js';
import { WagerTransaction } from './wagering/entities/wager-transaction.entity.js';
declare const _default: Partial<import("@mikro-orm/core").Options<import("@mikro-orm/postgresql").PostgreSqlDriver, import("@mikro-orm/postgresql").EntityManager<import("@mikro-orm/postgresql").PostgreSqlDriver>, (typeof Wallet | typeof LedgerEntry | typeof WagerTransaction)[]>>;
export default _default;
