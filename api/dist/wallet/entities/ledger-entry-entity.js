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
let LedgerEntry = class LedgerEntry {
    id;
    walletId;
    transactionId;
    direction;
    amount;
    balanceBefore;
    balanceAfter;
    createdAt;
};
__decorate([
    PrimaryKey({ type: 'number' }),
    __metadata("design:type", Number)
], LedgerEntry.prototype, "id", void 0);
__decorate([
    Property({ type: 'number' }),
    __metadata("design:type", Number)
], LedgerEntry.prototype, "walletId", void 0);
__decorate([
    Property({ type: 'number' }),
    __metadata("design:type", Number)
], LedgerEntry.prototype, "transactionId", void 0);
__decorate([
    Property({ type: 'string' }),
    __metadata("design:type", String)
], LedgerEntry.prototype, "direction", void 0);
__decorate([
    Property({ type: 'string', columnType: 'numeric(20,2)' }),
    __metadata("design:type", String)
], LedgerEntry.prototype, "amount", void 0);
__decorate([
    Property({ type: 'string', columnType: 'numeric(20,2)' }),
    __metadata("design:type", String)
], LedgerEntry.prototype, "balanceBefore", void 0);
__decorate([
    Property({ type: 'string', columnType: 'numeric(20,2)' }),
    __metadata("design:type", String)
], LedgerEntry.prototype, "balanceAfter", void 0);
__decorate([
    Property({ type: Date, onCreate: () => new Date() }),
    __metadata("design:type", Date)
], LedgerEntry.prototype, "createdAt", void 0);
LedgerEntry = __decorate([
    Unique({ properties: ['walletId', 'transactionId'] }),
    Entity()
], LedgerEntry);
export { LedgerEntry };
//# sourceMappingURL=ledger-entry-entity.js.map