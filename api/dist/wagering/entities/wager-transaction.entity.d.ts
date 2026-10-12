declare enum TransactionKind {
    BET = "BET",
    WIN = "WIN",
    LOSS = "LOSS",
    REFUND = "REFUND",
    ROLLBACK = "ROLLBACK"
}
declare enum TransactionStatus {
    PENDING = "PENDING",
    PENDING_REFERENCE = "PENDING_REFERENCE",
    PROCESSED = "PROCESSED",
    REJECTED = "REJECTED",
    FAILED = "FAILED"
}
export declare class WagerTransaction {
    id: number;
    providerId: string;
    externalTransactionId: string;
    referenceExternalTransactionId?: string;
    idempotencyKey: string;
    requestHash: string;
    playerId: string;
    walletId: number;
    roundId: string;
    gameId: string;
    kind: TransactionKind;
    amount: string;
    status: TransactionStatus;
    createdAt: Date;
}
export {};
