//importando decorators
import {Entity, Property, Unique, PrimaryKey} from '@mikro-orm/decorators/legacy'

//tipos de transação
enum TransactionKind {
    BET = 'BET',
    WIN = 'WIN',
    LOSS = 'LOSS',
    REFUND = 'REFUND',
    ROLLBACK = 'ROLLBACK'
}

//status da transação
enum TransactionStatus {
    PENDING = 'PENDING',
    PENDING_REFERENCE = 'PENDING_REFERENCE',
    PROCESSED = 'PROCESSED',
    REJECTED = 'REJECTED',
    FAILED = 'FAILED'
}

//criando entidade
@Entity()
//implementando unicidade para não ter transações duplicadas 
@Unique({properties: ['providerId', 'externalTransactionId']})
export class WagerTransaction{
    //chave primaria da entidade
    @PrimaryKey({type: 'number'})
    id!: number
    //id do provedor da aposta
    @Property({type: 'string'})
    providerId!: string
    //id da operação do provedor
    @Property({type: 'string'})
    externalTransactionId!: string
    //campo que faz referencia a uma transação externa
    @Property({type: 'string', nullable: true})
    referenceExternalTransactionId?: string
    //chave de idempotencia para evitar transações duplicadas
    @Property({type: 'string'})
    idempotencyKey!: string
    //campo para guardar hash do payload
    @Property({type: 'string'})
    requestHash!: string
    //id do jogador
    @Property({type: 'string'})
    playerId!: string
    //id da carteira
    @Property({type: 'number'})
    walletId!: number
    //id da rodada
    @Property({type: 'string'})
    roundId!: string
    //id do jogo
    @Property({type: 'string'})
    gameId!: string
    //tipo da opreação
    @Property({type: 'string'})
    kind!: TransactionKind
    //valor da transação
    @Property({type: 'string', columnType: 'numeric(20,2)'})
    amount!: string
    //status do transção
    @Property({type: 'string'})
    status!: TransactionStatus
    //data e hora da movimentação
    @Property({type: 'Date', onCreate: () => new Date()})
    createdAt!: Date
}