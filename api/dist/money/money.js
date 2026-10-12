import { Decimal } from 'decimal.js';
export class Money {
    value;
    currency;
    constructor(value, currency) {
        this.value = value;
        this.currency = currency;
    }
    static from(props) {
        const { amount, currency } = props;
        if (!/^-?\d+(\.\d{1,2})?$/.test(amount)) {
            throw new Error('Valor monetário inválido');
        }
        if (!/^[A-Z]{3}$/.test(currency)) {
            throw new Error('Moeda inválida');
        }
        return new Money(new Decimal(amount), currency);
    }
    static zero(currency) {
        return Money.from({ amount: '0.00', currency });
    }
    add(other) {
        this.assertSameCurrency(other);
        return new Money(this.value.plus(other.value), this.currency);
    }
    subtract(other) {
        this.assertSameCurrency(other);
        return new Money(this.value.minus(other.value), this.currency);
    }
    negate() {
        return new Money(this.value.negated(), this.currency);
    }
    isZero() {
        return this.value.isZero();
    }
    isPositive() {
        return this.value.isPositive();
    }
    isNegative() {
        return this.value.isNegative();
    }
    isLessThan(other) {
        this.assertSameCurrency(other);
        return this.value.lessThan(other.value);
    }
    equals(other) {
        this.assertSameCurrency(other);
        return this.value.equals(other.value);
    }
    toString() {
        return this.value.toFixed(2);
    }
    toJSON() {
        return {
            amount: this.toString(),
            currency: this.currency,
        };
    }
    assertSameCurrency(other) {
        if (this.currency !== other.currency) {
            throw new Error('Não é possível operar com moedas diferentes');
        }
    }
}
//# sourceMappingURL=money.js.map