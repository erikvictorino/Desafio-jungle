
import { Money } from '../../money/money.js';
import { WalletLedgerEntry } from './wallet-ledger-entry.js';

// Estado utilizado para reconstruir uma carteira do banco.
export interface WalletState {
  id: string;
  playerId: string;
  currency: string;
  balance: Money;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Wallet {
  // Somente a própria classe pode construir uma carteira diretamente.
  private constructor(
    public readonly id: string,
    public readonly playerId: string,
    public readonly currency: string,
    private _balance: Money,
    private _version: number,
    public readonly createdAt: Date,
    private _updatedAt: Date,
  ) {}

  // Abre uma carteira nova com saldo inicial e versão 1.
  static open(props: {
    id: string;
    playerId: string;
    initialBalance: Money;
  }): Wallet {
    if (props.initialBalance.isNegative()) {
      throw new Error('O saldo inicial não pode ser negativo');
    }

    return new Wallet(
      props.id,
      props.playerId,
      props.initialBalance.currency,
      props.initialBalance,
      1,
      new Date(),
      new Date(),
    );
  }

  // Reconstrói a carteira a partir dos dados persistidos.
  // Não reaplica as regras de abertura.
  static rehydrate(state: WalletState): Wallet {
    return new Wallet(
      state.id,
      state.playerId,
      state.currency,
      state.balance,
      state.version,
      state.createdAt,
      state.updatedAt,
    );
  }

  // Expõe o saldo sem permitir substituir diretamente a propriedade.
  get balance(): Money {
    return this._balance;
  }

  get version(): number {
    return this._version;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Debita dinheiro e retorna o lançamento correspondente.
  debit(
    ledgerId: string,
    transactionId: string,
    amount: Money,
    at: Date = new Date(),
  ): WalletLedgerEntry {
    this.assertSameCurrency(amount);

    if (!amount.isPositive()) {
      throw new Error('O débito precisa ser maior que zero');
    }

    // Calcula o novo saldo antes de alterar a carteira.
    const newBalance = this._balance.subtract(amount);

    if (newBalance.isNegative()) {
      throw new Error('Saldo insuficiente');
    }

    // Monta o lançamento com o saldo anterior e o posterior.
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

    // Só altera o estado depois de validar o lançamento.
    this._balance = newBalance;
    this._version += 1;
    this._updatedAt = at;

    return entry;
  }

  // Credita dinheiro e retorna o lançamento correspondente.
  credit(
    ledgerId: string,
    transactionId: string,
    amount: Money,
    at: Date = new Date(),
  ): WalletLedgerEntry {
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

  // Garante que a operação utiliza a moeda da carteira.
  private assertSameCurrency(amount: Money): void {
    if (this.currency !== amount.currency) {
      throw new Error('A moeda da operação difere da carteira');
    }
  }
}
