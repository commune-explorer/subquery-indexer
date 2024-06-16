// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type SubnetProps = Omit<Subnet, NonNullable<FunctionPropertyNames<Subnet>>| '_name'>;

export class Subnet implements Entity {

    constructor(
        
        id: string,
        netUid: number,
        registeredAt: number,
        timestamp: Date,
        extrinsicId: number,
        name: string,
    ) {
        this.id = id;
        this.netUid = netUid;
        this.registeredAt = registeredAt;
        this.timestamp = timestamp;
        this.extrinsicId = extrinsicId;
        this.name = name;
        
    }

    public id: string;
    public netUid: number;
    public registeredAt: number;
    public timestamp: Date;
    public extrinsicId: number;
    public name: string;
    

    get _name(): string {
        return 'Subnet';
    }

    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Subnet entity without an ID");
        await store.set('Subnet', id.toString(), this);
    }

    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Subnet entity without an ID");
        await store.remove('Subnet', id.toString());
    }

    static async get(id:string): Promise<Subnet | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Subnet entity without an ID");
        const record = await store.get('Subnet', id.toString());
        if (record) {
            return this.create(record as SubnetProps);
        } else {
            return;
        }
    }

    static async getByNetUid(netUid: number): Promise<Subnet[] | undefined>{
      const records = await store.getByField('Subnet', 'netUid', netUid);
      return records.map(record => this.create(record as SubnetProps));
    }

    static async getByRegisteredAt(registeredAt: number): Promise<Subnet[] | undefined>{
      const records = await store.getByField('Subnet', 'registeredAt', registeredAt);
      return records.map(record => this.create(record as SubnetProps));
    }

    static async getByTimestamp(timestamp: Date): Promise<Subnet[] | undefined>{
      const records = await store.getByField('Subnet', 'timestamp', timestamp);
      return records.map(record => this.create(record as SubnetProps));
    }

    static async getByName(name: string): Promise<Subnet[] | undefined>{
      const records = await store.getByField('Subnet', 'name', name);
      return records.map(record => this.create(record as SubnetProps));
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<SubnetProps>[], options?: GetOptions<SubnetProps>): Promise<Subnet[]> {
        const records = await store.getByFields('Subnet', filter, options);
        return records.map(record => this.create(record as SubnetProps));
    }

    static create(record: SubnetProps): Subnet {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(
            record.id,
            record.netUid,
            record.registeredAt,
            record.timestamp,
            record.extrinsicId,
            record.name,
        );
        Object.assign(entity,record);
        return entity;
    }
}
