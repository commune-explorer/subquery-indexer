// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';


import {
    DelegateAction,
} from '../enums';

export type DelegationEventProps = Omit<DelegationEvent, NonNullable<FunctionPropertyNames<DelegationEvent>>| '_name'>;

export class DelegationEvent implements Entity {

    constructor(
        
        id: string,
        height: number,
        extrinsicId: number,
        netUid: number,
        account: string,
        module: string,
        amount: bigint,
        action: DelegateAction,
    ) {
        this.id = id;
        this.height = height;
        this.extrinsicId = extrinsicId;
        this.netUid = netUid;
        this.account = account;
        this.module = module;
        this.amount = amount;
        this.action = action;
        
    }

    public id: string;
    public height: number;
    public extrinsicId: number;
    public netUid: number;
    public account: string;
    public module: string;
    public amount: bigint;
    public action: DelegateAction;
    

    get _name(): string {
        return 'DelegationEvent';
    }

    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save DelegationEvent entity without an ID");
        await store.set('DelegationEvent', id.toString(), this);
    }

    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove DelegationEvent entity without an ID");
        await store.remove('DelegationEvent', id.toString());
    }

    static async get(id:string): Promise<DelegationEvent | undefined>{
        assert((id !== null && id !== undefined), "Cannot get DelegationEvent entity without an ID");
        const record = await store.get('DelegationEvent', id.toString());
        if (record) {
            return this.create(record as DelegationEventProps);
        } else {
            return;
        }
    }

    static async getByHeight(height: number): Promise<DelegationEvent[] | undefined>{
      const records = await store.getByField('DelegationEvent', 'height', height);
      return records.map(record => this.create(record as DelegationEventProps));
    }

    static async getByNetUid(netUid: number): Promise<DelegationEvent[] | undefined>{
      const records = await store.getByField('DelegationEvent', 'netUid', netUid);
      return records.map(record => this.create(record as DelegationEventProps));
    }

    static async getByModule(module: string): Promise<DelegationEvent[] | undefined>{
      const records = await store.getByField('DelegationEvent', 'module', module);
      return records.map(record => this.create(record as DelegationEventProps));
    }

    static async getByAmount(amount: bigint): Promise<DelegationEvent[] | undefined>{
      const records = await store.getByField('DelegationEvent', 'amount', amount);
      return records.map(record => this.create(record as DelegationEventProps));
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<DelegationEventProps>[], options?: GetOptions<DelegationEventProps>): Promise<DelegationEvent[]> {
        const records = await store.getByFields('DelegationEvent', filter, options);
        return records.map(record => this.create(record as DelegationEventProps));
    }

    static create(record: DelegationEventProps): DelegationEvent {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(
            record.id,
            record.height,
            record.extrinsicId,
            record.netUid,
            record.account,
            record.module,
            record.amount,
            record.action,
        );
        Object.assign(entity,record);
        return entity;
    }
}
