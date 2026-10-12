var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property, Unique, PrimaryKey } from '@mikro-orm/decorators/legacy';
var TransactionKind;
(function (TransactionKind) {
    TransactionKind["BET"] = "BET";
    TransactionKind["WIN"] = "WIN";
    TransactionKind["LOSS"] = "LOSS";
    TransactionKind["REFUND"] = "REFUND";
    TransactionKind["ROLLBACK"] = "ROLLBACK";
})(TransactionKind || (TransactionKind = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "PENDING";
    TransactionStatus["PENDING_REFERENCE"] = "PENDING_REFERENCE";
    TransactionStatus["PROCESSED"] = "PROCESSED";
    TransactionStatus["REJECTED"] = "REJECTED";
    TransactionStatus["FAILED"] = "FAILED";
})(TransactionStatus || (TransactionStatus = {}));
let WagerTransaction = class WagerTransaction {
    id;
    providerId;
    externalTransactionId;
    referenceExternalTransactionId;
    idempotencyKey;
    requestHash;
    playerId;
    walletId;
    roundId;
    gameId;
    kind;
    amount;
    status;
    createdAt;
};
__decorate([
    PrimaryKey({ type: 'number' }),
    __metadata("design:type", Number)
], WagerTransaction.prototype, "id", void 0);
__decorate([
    Property({ type: 'string' }),
    __metadata("design:type", String)
], WagerTransaction.prototype, "providerId", void 0);
__decorate([
    Property({ type: 'string' }),
    __metadata("design:type", String)
], WagerTransaction.prototype, "externalTransactionId", void 0);
__decorate([
    Property({ type: 'string', nullable: true }),
    __metadata("design:type", String)
], WagerTransaction.prototype, "referenceExternalTransactionId", void 0);
__decorate([
    Property({ type: 'string' }),
    __metadata("design:type", String)
], WagerTransaction.prototype, "idempotencyKey", void 0);
__decorate([
    Property({ type: 'string' }),
    __metadata("design:type", String)
], WagerTransaction.prototype, "requestHash", void 0);
__decorate([
    Property({ type: 'string' }),
    __metadata("design:type", String)
], WagerTransaction.prototype, "playerId", void 0);
__decorate([
    Property({ type: 'number' }),
    __metadata("design:type", Number)
], WagerTransaction.prototype, "walletId", void 0);
__decorate([
    Property({ type: 'string' }),
    __metadata("design:type", String)
], WagerTransaction.prototype, "roundId", void 0);
__decorate([
    Property({ type: 'string' }),
    __metadata("design:type", String)
], WagerTransaction.prototype, "gameId", void 0);
__decorate([
    Property({ type: 'string' }),
    __metadata("design:type", String)
], WagerTransaction.prototype, "kind", void 0);
__decorate([
    Property({ type: 'string', columnType: 'numeric(20,2)' }),
    __metadata("design:type", String)
], WagerTransaction.prototype, "amount", void 0);
__decorate([
    Property({ type: 'string' }),
    __metadata("design:type", String)
], WagerTransaction.prototype, "status", void 0);
__decorate([
    Property({ type: 'Date', onCreate: () => new Date() }),
    __metadata("design:type", Date)
], WagerTransaction.prototype, "createdAt", void 0);
WagerTransaction = __decorate([
    Entity(),
    Unique({ properties: ['providerId', 'externalTransactionId'] })
], WagerTransaction);
export { WagerTransaction };
//# sourceMappingURL=wager-transaction.entity.js.map