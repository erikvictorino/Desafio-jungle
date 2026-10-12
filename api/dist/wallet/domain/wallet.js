import { WalletLedgerEntry } from './wallet-ledger-entry.js';
export class Wallet {
    id;
    playerId;
    currency;
    _balance;
    _version;
    createdAt;
    _updatedAt;
    constructor(id, playerId, currency, _balance, _version, createdAt, _updatedAt) {
        this.id = id;
        this.playerId = playerId;
        this.currency = currency;
        this._balance = _balance;
        this._version = _version;
        this.createdAt = createdAt;
        this._updatedAt = _updatedAt;
    }
    static open(props) {
        if (props.initialBalance.isNegative()) {
            throw new Error('O saldo inicial não pode ser negativo');
        }
        return new Wallet(props.id, props.playerId, props.initialBalance.currency, props.initialBalance, 1, new Date(), new Date());
    }
    static rehydrate(state) {
        return new Wallet(state.id, state.playerId, state.currency, state.balance, state.version, state.createdAt, state.updatedAt);
    }
    get balance() {
        return this._balance;
    }
    get version() {
        return this._version;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    debit(ledgerId, transactionId, amount, at = new Date()) {
        this.assertSameCurrency(amount);
        if (!amount.isPositive()) {
            throw new Error('O débito precisa ser maior que zero');
        }
        const newBalance = this._balance.subtract(amount);
        if (newBalance.isNegative()) {
            throw new Error('Saldo insuficiente');
        }
        const entry = WalletLedgerEntry.create({
            id: ledgerId,
            walletId: this.id,
            transactionId,
            direction: 'DEBIT',
            amount,
            balanceBefore: this._balance,
            balanceAfter: newBalance,
            createdAt: at,
        });
        this._balance = newBalance;
        this._version += 1;
        this._updatedAt = at;
        return entry;
    }
    credit(ledgerId, transactionId, amount, at = new Date()) {
        this.assertSameCurrency(amount);
        if (!amount.isPositive()) {
            throw new Error('O crédito precisa ser maior que zero');
        }
        const newBalance = this._balance.add(amount);
        const entry = WalletLedgerEntry.create({
            id: ledgerId,
            walletId: this.id,
            transactionId,
            direction: 'CREDIT',
            amount,
            balanceBefore: this._balance,
            balanceAfter: newBalance,
            createdAt: at,
        });
        this._balance = newBalance;
        this._version += 1;
        this._updatedAt = at;
        return entry;
    }
    assertSameCurrency(amount) {
        if (this.currency !== amount.currency) {
            throw new Error('A moeda da operação difere da carteira');
        }
    }
}
//# sourceMappingURL=wallet.js.map