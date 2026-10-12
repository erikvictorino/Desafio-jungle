
import { Decimal } from 'decimal.js';

// Dados necessários para representar um valor monetário.
export interface MoneyProps {
  amount: string;
  currency: string;
}

// Representa dinheiro sem usar number para cálculos monetários.
export class Money {
  // O construtor privado obriga a criação pelos métodos da classe.
  private constructor(
    private readonly value: Decimal,
    public readonly currency: string,
  ) {}

  // Cria um Money validando o formato recebido.
  static from(props: MoneyProps): Money {
    const { amount, currency } = props;

    // Aceita somente valores decimais com até duas casas.
    // Impede notação científica e strings vazias.
    if (!/^-?\d+(\.\d{1,2})?$/.test(amount)) {
      throw new Error('Valor monetário inválido');
    }

    // Valida o formato do código da moeda, como BRL.
    if (!/^[A-Z]{3}$/.test(currency)) {
      throw new Error('Moeda inválida');
    }

    return new Money(new Decimal(amount), currency);
  }

  // Cria um valor zero para determinada moeda.
  static zero(currency: string): Money {
    return Money.from({ amount: '0.00', currency });
  }

  // Soma dois valores da mesma moeda.
  add(other: Money): Money {
    this.assertSameCurrency(other);

    return new Money(this.value.plus(other.value), this.currency);
  }

  // Subtrai dois valores da mesma moeda.
  subtract(other: Money): Money {
    this.assertSameCurrency(other);

    return new Money(this.value.minus(other.value), this.currency);
  }

  // Retorna um novo Money com o sinal invertido.
  negate(): Money {
    return new Money(this.value.negated(), this.currency);
  }

  isZero(): boolean {
    return this.value.isZero();
  }

  isPositive(): boolean {
    return this.value.isPositive();
  }

  isNegative(): boolean {
    return this.value.isNegative();
  }

  isLessThan(other: Money): boolean {
    this.assertSameCurrency(other);

    return this.value.lessThan(other.value);
  }

  equals(other: Money): boolean {
    this.assertSameCurrency(other);

    return this.value.equals(other.value);
  }

  // Formata o valor sempre com duas casas decimais.
  toString(): string {
    return this.value.toFixed(2);
  }

  // Define como o valor será convertido para JSON.
  toJSON(): MoneyProps {
    return {
      amount: this.toString(),
      currency: this.currency,
    };
  }

  // Impede operações entre moedas diferentes.
  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error('Não é possível operar com moedas diferentes');
    }
  }
}
