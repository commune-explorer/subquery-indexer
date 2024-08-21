// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type DelegateBalanceProps = Omit<DelegateBalance, NonNullable<FunctionPropertyNames<DelegateBalance>>| '_name'>;

export class DelegateBalance implements Entity {

    constructor(
        
        id: string,
        netUid: number,
        lastUpdate: number,
        account: string,
        module: string,
        amount: bigint,
    ) {
        this.id = id;
        this.netUid = netUid;
        this.lastUpdate = lastUpdate;
        this.account = account;
        this.module = module;
        this.amount = amount;
        
    }

    public id: string;
    public netUid: number;
    public lastUpdate: number;
    public account: string;
    public module: string;
    public amount: bigint;
    

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

    static async getByNetUid(netUid: number): Promise<DelegateBalance[] | undefined>{
      const records = await store.getByField('DelegateBalance', 'netUid', netUid);
      return records.map(record => this.create(record as DelegateBalanceProps));
    }

    static async getByLastUpdate(lastUpdate: number): Promise<DelegateBalance[] | undefined>{
      const records = await store.getByField('DelegateBalance', 'lastUpdate', lastUpdate);
      return records.map(record => this.create(record as DelegateBalanceProps));
    }

    static async getByAccount(account: string): Promise<DelegateBalance[] | undefined>{
      const records = await store.getByField('DelegateBalance', 'account', account);
      return records.map(record => this.create(record as DelegateBalanceProps));
    }

    static async getByModule(module: string): Promise<DelegateBalance[] | undefined>{
      const records = await store.getByField('DelegateBalance', 'module', module);
      return records.map(record => this.create(record as DelegateBalanceProps));
    }

    static async getByAmount(amount: bigint): Promise<DelegateBalance[] | undefined>{
      const records = await store.getByField('DelegateBalance', 'amount', amount);
      return records.map(record => this.create(record as DelegateBalanceProps));
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
            record.netUid,
            record.lastUpdate,
            record.account,
            record.module,
            record.amount,
        );
        Object.assign(entity,record);
        return entity;
    }
}
