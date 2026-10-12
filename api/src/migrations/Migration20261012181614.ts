import { Migration } from '@mikro-orm/migrations';

export class Migration20261012181614 extends Migration {

  override name = 'Migration20261012181614';

  override up(): void | Promise<void> {
    this.addSql(`create table "wager_transaction" ("id" serial primary key, "provider_id" varchar(255) not null, "external_transaction_id" varchar(255) not null, "reference_external_transaction_id" varchar(255) null, "idempotency_key" varchar(255) not null, "request_hash" varchar(255) not null, "player_id" varchar(255) not null, "wallet_id" int not null, "round_id" varchar(255) not null, "game_id" varchar(255) not null, "kind" varchar(255) not null, "amount" numeric(20,2) not null, "status" varchar(255) not null, "created_at" timestamptz not null);`);
    this.addSql(`alter table "wager_transaction" add constraint "wager_transaction_provider_id_external_transaction_id_unique" unique ("provider_id", "external_transaction_id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "wager_transaction" cascade;`);
  }

}
