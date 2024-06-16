// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type NeuronBondProps = Omit<NeuronBond, NonNullable<FunctionPropertyNames<NeuronBond>>| '_name'>;

export class NeuronBond implements Entity {

    constructor(
        
        id: string,
        lastUpdate: number,
        netUid: number,
        uid: number,
        value: string,
    ) {
        this.id = id;
        this.lastUpdate = lastUpdate;
        this.netUid = netUid;
        this.uid = uid;
        this.value = value;
        
    }

    public id: string;
    public lastUpdate: number;
    public netUid: number;
    public uid: number;
    public value: string;
    

    get _name(): string {
        return 'NeuronBond';
    }

    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save NeuronBond entity without an ID");
        await store.set('NeuronBond', id.toString(), this);
    }

    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove NeuronBond entity without an ID");
        await store.remove('NeuronBond', id.toString());
    }

    static async get(id:string): Promise<NeuronBond | undefined>{
        assert((id !== null && id !== undefined), "Cannot get NeuronBond entity without an ID");
        const record = await store.get('NeuronBond', id.toString());
        if (record) {
            return this.create(record as NeuronBondProps);
        } else {
            return;
        }
    }

    static async getByNetUid(netUid: number): Promise<NeuronBond[] | undefined>{
      const records = await store.getByField('NeuronBond', 'netUid', netUid);
      return records.map(record => this.create(record as NeuronBondProps));
    }

    static async getByUid(uid: number): Promise<NeuronBond[] | undefined>{
      const records = await store.getByField('NeuronBond', 'uid', uid);
      return records.map(record => this.create(record as NeuronBondProps));
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<NeuronBondProps>[], options?: GetOptions<NeuronBondProps>): Promise<NeuronBond[]> {
        const records = await store.getByFields('NeuronBond', filter, options);
        return records.map(record => this.create(record as NeuronBondProps));
    }

    static create(record: NeuronBondProps): NeuronBond {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(
            record.id,
            record.lastUpdate,
            record.netUid,
            record.uid,
            record.value,
        );
        Object.assign(entity,record);
        return entity;
    }
}
