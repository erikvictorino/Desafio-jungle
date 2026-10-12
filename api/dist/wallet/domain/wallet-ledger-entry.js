export class WalletLedgerEntry {
    id;
    walletId;
    transactionId;
    direction;
    amount;
    balanceBefore;
    balanceAfter;
    createdAt;
    constructor(id, walletId, transactionId, direction, amount, balanceBefore, balanceAfter, createdAt) {
        this.id = id;
        this.walletId = walletId;
        this.transactionId = transactionId;
        this.direction = direction;
        this.amount = amount;
        this.balanceBefore = balanceBefore;
        this.balanceAfter = balanceAfter;
        this.createdAt = createdAt;
    }
    static create(props) {
        if (!props.amount.isPositive()) {
            throw new Error('O valor do lançamento precisa ser positivo');
        }
        if (props.amount.currency !== props.balanceBefore.currency ||
            props.amount.currency !== props.balanceAfter.currency) {
            throw new Error('Moedas incompatíveis no lançamento');
        }
        const expectedBalance = props.direction === 'CREDIT'
            ? props.balanceBefore.add(props.amount)
            : props.balanceBefore.subtract(props.amount);
        if (!expectedBalance.equals(props.balanceAfter)) {
            throw new Error('O lançamento possui saldos inconsistentes');
        }
        if (props.balanceAfter.isNegative()) {
            throw new Error('O lançamento não pode gerar saldo negativo');
        }
        return new WalletLedgerEntry(props.id, props.walletId, props.transactionId, props.direction, props.amount, props.balanceBefore, props.balanceAfter, props.createdAt ?? new Date());
    }
    isBalanced() {
        const expectedBalance = this.direction === 'CREDIT'
            ? this.balanceBefore.add(this.amount)
            : this.balanceBefore.subtract(this.amount);
        return expectedBalance.equals(this.balanceAfter);
    }
}
//# sourceMappingURL=wallet-ledger-entry.js.map