import { Money } from '../../money/money.js';
export type LedgerDirection = 'DEBIT' | 'CREDIT';
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
export declare class WalletLedgerEntry {
    readonly id: string;
    readonly walletId: string;
    readonly transactionId: string;
    readonly direction: LedgerDirection;
    readonly amount: Money;
    readonly balanceBefore: Money;
    readonly balanceAfter: Money;
    readonly createdAt: Date;
    private constructor();
    static create(props: CreateLedgerEntryProps): WalletLedgerEntry;
    isBalanced(): boolean;
}
