//importando decoradores
import {Entity, Property, PrimaryKey, Unique} from '@mikro-orm/decorators/legacy';

//mapeando a classe wallet para uma entidade no banco
@Entity()
@Unique({properties: ['playerId', 'currency']})//criando unicidade de playerId e currency, evitando que o player tenha carteiras com currency repetido
export class Wallet{
    //definindo chave primaria
    @PrimaryKey()
    id!: number;
    //coluna player id
    @Property()
    playerId!: string;//mapeia uma propriedade da classe para uma coluna no banco
    //coluna currency
    @Property() 
    currency!: string;
    //coluna balance
    @Property({columnType: 'numeric(20,2)'})//indica ao postgre que a coluna tera ate 18 digitos inteiros com 2 decimais
    balance!: string;
    //coluna versão
    @Property({columnType: 'integer', default: 1})//começa com valor 1
    version!: number;
    //coluna de datas
    @Property({onCreate: () => new Date()})
    createdAt!: Date;
    @Property({
        onCreate: () => new Date(),
        onUpdate: () => new Date(),
    })
    updatedAt!: Date;
}