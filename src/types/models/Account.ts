// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type AccountProps = Omit<Account, NonNullable<FunctionPropertyNames<Account>>| '_name'>;

export class Account implements Entity {

    constructor(
        
        id: string,
        address: string,
        createdAt: bigint,
        updatedAt: bigint,
        balance_free: bigint,
        balance_staked: bigint,
        balance_total: bigint,
    ) {
        this.id = id;
        this.address = address;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.balance_free = balance_free;
        this.balance_staked = balance_staked;
        this.balance_total = balance_total;
        
    }

    public id: string;
    public address: string;
    public createdAt: bigint;
    public updatedAt: bigint;
    public balance_free: bigint;
    public balance_staked: bigint;
    public balance_total: bigint;
    

    get _name(): string {
        return 'Account';
    }

    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Account entity without an ID");
        await store.set('Account', id.toString(), this);
    }

    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Account entity without an ID");
        await store.remove('Account', id.toString());
    }

    static async get(id:string): Promise<Account | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Account entity without an ID");
        const record = await store.get('Account', id.toString());
        if (record) {
            return this.create(record as AccountProps);
        } else {
            return;
        }
    }

    static async getByAddress(address: string): Promise<Account[] | undefined>{
      const records = await store.getByField('Account', 'address', address);
      return records.map(record => this.create(record as AccountProps));
    }

    static async getByCreatedAt(createdAt: bigint): Promise<Account[] | undefined>{
      const records = await store.getByField('Account', 'createdAt', createdAt);
      return records.map(record => this.create(record as AccountProps));
    }

    static async getByUpdatedAt(updatedAt: bigint): Promise<Account[] | undefined>{
      const records = await store.getByField('Account', 'updatedAt', updatedAt);
      return records.map(record => this.create(record as AccountProps));
    }

    static async getByBalance_free(balance_free: bigint): Promise<Account[] | undefined>{
      const records = await store.getByField('Account', 'balance_free', balance_free);
      return records.map(record => this.create(record as AccountProps));
    }

    static async getByBalance_staked(balance_staked: bigint): Promise<Account[] | undefined>{
      const records = await store.getByField('Account', 'balance_staked', balance_staked);
      return records.map(record => this.create(record as AccountProps));
    }

    static async getByBalance_total(balance_total: bigint): Promise<Account[] | undefined>{
      const records = await store.getByField('Account', 'balance_total', balance_total);
      return records.map(record => this.create(record as AccountProps));
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<AccountProps>[], options?: GetOptions<AccountProps>): Promise<Account[]> {
        const records = await store.getByFields('Account', filter, options);
        return records.map(record => this.create(record as AccountProps));
    }

    static create(record: AccountProps): Account {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(
            record.id,
            record.address,
            record.createdAt,
            record.updatedAt,
            record.balance_free,
            record.balance_staked,
            record.balance_total,
        );
        Object.assign(entity,record);
        return entity;
    }
}
