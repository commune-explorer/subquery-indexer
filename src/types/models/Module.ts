// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression} from "@subql/types-core";
import assert from 'assert';



export type ModuleProps = Omit<Module, NonNullable<FunctionPropertyNames<Module>>| '_name'>;

export class Module implements Entity {

    constructor(
        
        id: string,
        netUid: number,
        uid: number,
        key: string,
        registeredAt: number,
        timestamp: Date,
        extrinsicId: number,
        address: string,
        name: string,
    ) {
        this.id = id;
        this.netUid = netUid;
        this.uid = uid;
        this.key = key;
        this.registeredAt = registeredAt;
        this.timestamp = timestamp;
        this.extrinsicId = extrinsicId;
        this.address = address;
        this.name = name;
        
    }

    public id: string;
    public netUid: number;
    public uid: number;
    public key: string;
    public registeredAt: number;
    public timestamp: Date;
    public extrinsicId: number;
    public address: string;
    public name: string;
    

    get _name(): string {
        return 'Module';
    }

    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Module entity without an ID");
        await store.set('Module', id.toString(), this);
    }

    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Module entity without an ID");
        await store.remove('Module', id.toString());
    }

    static async get(id:string): Promise<Module | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Module entity without an ID");
        const record = await store.get('Module', id.toString());
        if (record) {
            return this.create(record as ModuleProps);
        } else {
            return;
        }
    }

    static async getByNetUid(netUid: number): Promise<Module[] | undefined>{
      const records = await store.getByField('Module', 'netUid', netUid);
      return records.map(record => this.create(record as ModuleProps));
    }

    static async getByUid(uid: number): Promise<Module[] | undefined>{
      const records = await store.getByField('Module', 'uid', uid);
      return records.map(record => this.create(record as ModuleProps));
    }

    static async getByKey(key: string): Promise<Module[] | undefined>{
      const records = await store.getByField('Module', 'key', key);
      return records.map(record => this.create(record as ModuleProps));
    }

    static async getByRegisteredAt(registeredAt: number): Promise<Module[] | undefined>{
      const records = await store.getByField('Module', 'registeredAt', registeredAt);
      return records.map(record => this.create(record as ModuleProps));
    }

    static async getByTimestamp(timestamp: Date): Promise<Module[] | undefined>{
      const records = await store.getByField('Module', 'timestamp', timestamp);
      return records.map(record => this.create(record as ModuleProps));
    }

    static async getByAddress(address: string): Promise<Module[] | undefined>{
      const records = await store.getByField('Module', 'address', address);
      return records.map(record => this.create(record as ModuleProps));
    }

    static async getByName(name: string): Promise<Module[] | undefined>{
      const records = await store.getByField('Module', 'name', name);
      return records.map(record => this.create(record as ModuleProps));
    }

    static async getByFields(filter: FieldsExpression<ModuleProps>[], options?: { offset?: number, limit?: number}): Promise<Module[]> {
        const records = await store.getByFields('Module', filter, options);
        return records.map(record => this.create(record as ModuleProps));
    }

    static create(record: ModuleProps): Module {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(
            record.id,
            record.netUid,
            record.uid,
            record.key,
            record.registeredAt,
            record.timestamp,
            record.extrinsicId,
            record.address,
            record.name,
        );
        Object.assign(entity,record);
        return entity;
    }
}
