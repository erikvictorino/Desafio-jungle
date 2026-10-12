var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { BadRequestException, Body, Controller, Headers, Post, } from '@nestjs/common';
import { WalletService, } from './wallet.service.js';
let WalletController = class WalletController {
    walletService;
    constructor(walletService) {
        this.walletService = walletService;
    }
    async createBet(body, idempotencyKey) {
        if (!idempotencyKey?.trim()) {
            throw new BadRequestException('O cabeçalho Idempotency-Key é obrigatório');
        }
        return this.walletService.createBet({
            ...body,
            idempotencyKey,
        });
    }
};
__decorate([
    Post(),
    __param(0, Body()),
    __param(1, Headers('idempotency-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WalletController.prototype, "createBet", null);
WalletController = __decorate([
    Controller('wagering/transactions'),
    __metadata("design:paramtypes", [WalletService])
], WalletController);
export { WalletController };
//# sourceMappingURL=wallet.controller.js.map