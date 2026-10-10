//importando decorators
import {Entity, Property, Unique, PrimaryKey} from '@mikro-orm/decorators/legacy'

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
    kind!: string
    //valor da transação
    @Property({type: 'string', columnType: 'numeric(20,2)'})
    amount!: string
    //status do transção
    @Property({type: 'string'})
    status!: string
    //data e hora da movimentação
    @Property({type: 'Date', onCreate: () => new Date()})
    createdAt!: Date
}