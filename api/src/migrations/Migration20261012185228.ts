import { Migration } from '@mikro-orm/migrations';

export class Migration20261012185228 extends Migration {

  override name = 'Migration20261012185228';

  override up(): void | Promise<void> {
    this.addSql(`create table "ledger_entry" ("id" serial primary key, "wallet_id" int not null, "transaction_id" int not null, "direction" varchar(255) not null, "amount" numeric(20,2) not null, "balance_before" numeric(20,2) not null, "balance_after" numeric(20,2) not null, "created_at" timestamptz not null);`);
    this.addSql(`alter table "ledger_entry" add constraint "ledger_entry_wallet_id_transaction_id_unique" unique ("wallet_id", "transaction_id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "ledger_entry" cascade;`);
  }

}
