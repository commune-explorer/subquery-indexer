// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type SubnetBurnProps = Omit<SubnetBurn, NonNullable<FunctionPropertyNames<SubnetBurn>>| '_name'>;

export class SubnetBurn implements Entity {

    constructor(
        
        id: string,
        netUid: number,
        lastUpate: number,
        burn: bigint,
    ) {
        this.id = id;
        this.netUid = netUid;
        this.lastUpate = lastUpate;
        this.burn = burn;
        
    }

    public id: string;
    public netUid: number;
    public lastUpate: number;
    public burn: bigint;
    

    get _name(): string {
        return 'SubnetBurn';
    }

    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save SubnetBurn entity without an ID");
        await store.set('SubnetBurn', id.toString(), this);
    }

    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove SubnetBurn entity without an ID");
        await store.remove('SubnetBurn', id.toString());
    }

    static async get(id:string): Promise<SubnetBurn | undefined>{
        assert((id !== null && id !== undefined), "Cannot get SubnetBurn entity without an ID");
        const record = await store.get('SubnetBurn', id.toString());
        if (record) {
            return this.create(record as SubnetBurnProps);
        } else {
            return;
        }
    }

    static async getByNetUid(netUid: number): Promise<SubnetBurn[] | undefined>{
      const records = await store.getByField('SubnetBurn', 'netUid', netUid);
      return records.map(record => this.create(record as SubnetBurnProps));
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<SubnetBurnProps>[], options?: GetOptions<SubnetBurnProps>): Promise<SubnetBurn[]> {
        const records = await store.getByFields('SubnetBurn', filter, options);
        return records.map(record => this.create(record as SubnetBurnProps));
    }

    static create(record: SubnetBurnProps): SubnetBurn {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(
            record.id,
            record.netUid,
            record.lastUpate,
            record.burn,
        );
        Object.assign(entity,record);
        return entity;
    }
}
