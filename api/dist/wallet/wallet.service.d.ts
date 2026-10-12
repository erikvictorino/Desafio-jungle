import { EntityManager } from '@mikro-orm/postgresql';
import { TransactionStatus } from '../wagering/entities/wager-transaction.entity.js';
export interface CreateBetInput {
    providerId: string;
    externalTransactionId: string;
    playerId: string;
    currency: string;
    amount: string;
    roundId: string;
    gameId: string;
    idempotencyKey: string;
}
export declare class WalletService {
    private readonly em;
    constructor(em: EntityManager);
    createBet(input: CreateBetInput): Promise<{
        transactionId: number;
        status: TransactionStatus;
        replayed: boolean;
        balance?: undefined;
        message?: undefined;
    } | {
        transactionId: number;
        status: TransactionStatus;
        balance: string;
        message: string;
        replayed?: undefined;
    } | {
        transactionId: number;
        status: TransactionStatus;
        balance: string;
        replayed: boolean;
        message?: undefined;
    }>;
}
