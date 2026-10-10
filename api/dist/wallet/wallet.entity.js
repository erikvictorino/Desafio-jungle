var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property, PrimaryKey, Unique } from '@mikro-orm/decorators/legacy';
let Wallet = class Wallet {
    id;
    playerId;
    currency;
    balance;
    version;
    createdAt;
    updatedAt;
};
__decorate([
    PrimaryKey(),
    __metadata("design:type", Number)
], Wallet.prototype, "id", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Wallet.prototype, "playerId", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Wallet.prototype, "currency", void 0);
__decorate([
    Property({ columnType: 'numeric(20,2)' }),
    __metadata("design:type", String)
], Wallet.prototype, "balance", void 0);
__decorate([
    Property({ columnType: 'integer', default: 1 }),
    __metadata("design:type", Number)
], Wallet.prototype, "version", void 0);
__decorate([
    Property({ onCreate: () => new Date() }),
    __metadata("design:type", Date)
], Wallet.prototype, "createdAt", void 0);
__decorate([
    Property({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
    }),
    __metadata("design:type", Date)
], Wallet.prototype, "updatedAt", void 0);
Wallet = __decorate([
    Entity(),
    Unique({ properties: ['playerId', 'currency'] })
], Wallet);
export { Wallet };
//# sourceMappingURL=wallet.entity.js.map