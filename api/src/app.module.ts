import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
//importando mikro orm
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { WalletModule } from './wallet/wallet.module.js';
//configuração do mikro
import mikroOrmConfig from './mikro-orm.config.js';

@Module({
  //configurando integração com banco de dados
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    WalletModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
