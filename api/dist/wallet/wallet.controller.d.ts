import { CreateBetInput, WalletService } from './wallet.service.js';
type CreateBetBody = Omit<CreateBetInput, 'idempotencyKey'>;
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    createBet(body: CreateBetBody, idempotencyKey?: string): Promise<{
        transactionId: number;
        status: import("../wagering/entities/wager-transaction.entity.js").TransactionStatus;
        replayed: boolean;
        balance?: undefined;
        message?: undefined;
    } | {
        transactionId: number;
        status: import("../wagering/entities/wager-transaction.entity.js").TransactionStatus;
        balance: string;
        message: string;
        replayed?: undefined;
    } | {
        transactionId: number;
        status: import("../wagering/entities/wager-transaction.entity.js").TransactionStatus;
        balance: string;
        replayed: boolean;
        message?: undefined;
    }>;
}
export {};
