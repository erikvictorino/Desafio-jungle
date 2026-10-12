//importando decorators
import {Entity, Property, PrimaryKey, Unique} from '@mikro-orm/decorators/legacy'

//criando entidade
@Unique({properties: ['walletId', 'transactionId']})
@Entity()
export class LedgerEntry{
    //chave primaaria
    @PrimaryKey({type: 'number'})
    id!: number
    //ID da carteira do player
    @Property({type: 'number'})
    walletId!: number
    //ID da transação
    @Property({type: 'number'})
    transactionId!: number
    //se é debito ou credito
    @Property({type: 'string'})
    direction!: string
    //o valor debitado
    @Property({type: 'string', columnType: 'numeric(20,2)'})
    amount!: string
    //o valor antes da transação
    @Property({type: 'string', columnType: 'numeric(20,2)'})
    balanceBefore!: string
    //valor depois da transção
    @Property({type: 'string', columnType: 'numeric(20,2)'})
    balanceAfter!: string
    //data de criação
    @Property({type: Date, onCreate: () => new Date()})
    createdAt!: Date
}