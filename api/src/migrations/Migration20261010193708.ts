import { Migration } from '@mikro-orm/migrations';

export class Migration20261010193708 extends Migration {

  override name = 'Migration20261010193708';

  override up(): void | Promise<void> {
    this.addSql(`create table "wallet" ("id" serial primary key, "player_id" varchar(255) not null, "currency" varchar(255) not null, "balance" numeric(20,2) not null, "version" integer not null default 1, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);
    this.addSql(`alter table "wallet" add constraint "wallet_player_id_currency_unique" unique ("player_id", "currency");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "wallet" cascade;`);
  }
}
