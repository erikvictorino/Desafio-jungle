import { Money } from '../../money/money.js';
import { WalletLedgerEntry } from './wallet-ledger-entry.js';
export interface WalletState {
    id: string;
    playerId: string;
    currency: string;
    balance: Money;
    version: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Wallet {
    readonly id: string;
    readonly playerId: string;
    readonly currency: string;
    private _balance;
    private _version;
    readonly createdAt: Date;
    private _updatedAt;
    private constructor();
    static open(props: {
        id: string;
        playerId: string;
        initialBalance: Money;
    }): Wallet;
    static rehydrate(state: WalletState): Wallet;
    get balance(): Money;
    get version(): number;
    get updatedAt(): Date;
    debit(ledgerId: string, transactionId: string, amount: Money, at?: Date): WalletLedgerEntry;
    credit(ledgerId: string, transactionId: string, amount: Money, at?: Date): WalletLedgerEntry;
    private assertSameCurrency;
}
