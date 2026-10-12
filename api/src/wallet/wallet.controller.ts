
import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';

import {
  CreateBetInput,
  WalletService,
} from './wallet.service.js';

type CreateBetBody = Omit<CreateBetInput, 'idempotencyKey'>;

@Controller('wagering/transactions')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  async createBet(
    @Body() body: CreateBetBody,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    if (!idempotencyKey?.trim()) {
      throw new BadRequestException(
        'O cabeçalho Idempotency-Key é obrigatório',
      );
    }

    return this.walletService.createBet({
      ...body,
      idempotencyKey,
    });
  }
}
