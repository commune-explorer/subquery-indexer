// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type DelegateBalanceProps = Omit<DelegateBalance, NonNullable<FunctionPropertyNames<DelegateBalance>>| '_name'>;

export class DelegateBalance implements Entity {

    constructor(
        
        id: string,
        account: string,
        module: string,
        amount: bigint,
        lastUpdate: number,
    ) {
        this.id = id;
        this.account = account;
        this.module = module;
        this.amount = amount;
        this.lastUpdate = lastUpdate;
        
    }

    public id: string;
    public account: string;
    public module: string;
    public amount: bigint;
    public lastUpdate: number;
    

    get _name(): string {
        return 'DelegateBalance';
    }

    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save DelegateBalance entity without an ID");
        await store.set('DelegateBalance', id.toString(), this);
    }

    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove DelegateBalance entity without an ID");
        await store.remove('DelegateBalance', id.toString());
    }

    static async get(id:string): Promise<DelegateBalance | undefined>{
        assert((id !== null && id !== undefined), "Cannot get DelegateBalance entity without an ID");
        const record = await store.get('DelegateBalance', id.toString());
        if (record) {
            return this.create(record as DelegateBalanceProps);
        } else {
            return;
        }
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<DelegateBalanceProps>[], options?: GetOptions<DelegateBalanceProps>): Promise<DelegateBalance[]> {
        const records = await store.getByFields('DelegateBalance', filter, options);
        return records.map(record => this.create(record as DelegateBalanceProps));
    }

    static create(record: DelegateBalanceProps): DelegateBalance {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(
            record.id,
            record.account,
            record.module,
            record.amount,
            record.lastUpdate,
        );
        Object.assign(entity,record);
        return entity;
    }
}
