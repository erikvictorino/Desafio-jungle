
import { Money } from '../../money/money.js';

// Só existem essas duas direções de movimentação.
export type LedgerDirection = 'DEBIT' | 'CREDIT';

// Dados necessários para criar um lançamento.
export interface CreateLedgerEntryProps {
  id: string;
  walletId: string;
  transactionId: string;
  direction: LedgerDirection;
  amount: Money;
  balanceBefore: Money;
  balanceAfter: Money;
  createdAt?: Date;
}

export class WalletLedgerEntry {
  // Propriedades readonly: o lançamento não oferece métodos de alteração.
  private constructor(
    public readonly id: string,
    public readonly walletId: string,
    public readonly transactionId: string,
    public readonly direction: LedgerDirection,
    public readonly amount: Money,
    public readonly balanceBefore: Money,
    public readonly balanceAfter: Money,
    public readonly createdAt: Date,
  ) {}

  // Cria um lançamento validando a matemática da movimentação.
  static create(props: CreateLedgerEntryProps): WalletLedgerEntry {
    if (!props.amount.isPositive()) {
      throw new Error('O valor do lançamento precisa ser positivo');
    }

    // A movimentação e os saldos precisam usar a mesma moeda.
    if (
      props.amount.currency !== props.balanceBefore.currency ||
      props.amount.currency !== props.balanceAfter.currency
    ) {
      throw new Error('Moedas incompatíveis no lançamento');
    }

    // Calcula qual deveria ser o saldo após a operação.
    const expectedBalance =
      props.direction === 'CREDIT'
        ? props.balanceBefore.add(props.amount)
        : props.balanceBefore.subtract(props.amount);

    // Impede registrar saldos que não correspondam à movimentação.
    if (!expectedBalance.equals(props.balanceAfter)) {
      throw new Error('O lançamento possui saldos inconsistentes');
    }

    // O saldo não pode ficar negativo.
    if (props.balanceAfter.isNegative()) {
      throw new Error('O lançamento não pode gerar saldo negativo');
    }

    return new WalletLedgerEntry(
      props.id,
      props.walletId,
      props.transactionId,
      props.direction,
      props.amount,
      props.balanceBefore,
      props.balanceAfter,
      props.createdAt ?? new Date(),
    );
  }

  // Confere se o lançamento mantém a igualdade matemática.
  isBalanced(): boolean {
    const expectedBalance =
      this.direction === 'CREDIT'
        ? this.balanceBefore.add(this.amount)
        : this.balanceBefore.subtract(this.amount);

    return expectedBalance.equals(this.balanceAfter);
  }
}
