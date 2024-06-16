// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type WeightProps = Omit<Weight, NonNullable<FunctionPropertyNames<Weight>>| '_name'>;

export class Weight implements Entity {

    constructor(
        
        id: string,
        netUid: number,
        uid: number,
        weights: string,
        height: number,
    ) {
        this.id = id;
        this.netUid = netUid;
        this.uid = uid;
        this.weights = weights;
        this.height = height;
        
    }

    public id: string;
    public netUid: number;
    public uid: number;
    public weights: string;
    public height: number;
    

    get _name(): string {
        return 'Weight';
    }

    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Weight entity without an ID");
        await store.set('Weight', id.toString(), this);
    }

    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Weight entity without an ID");
        await store.remove('Weight', id.toString());
    }

    static async get(id:string): Promise<Weight | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Weight entity without an ID");
        const record = await store.get('Weight', id.toString());
        if (record) {
            return this.create(record as WeightProps);
        } else {
            return;
        }
    }

    static async getByNetUid(netUid: number): Promise<Weight[] | undefined>{
      const records = await store.getByField('Weight', 'netUid', netUid);
      return records.map(record => this.create(record as WeightProps));
    }

    static async getByUid(uid: number): Promise<Weight[] | undefined>{
      const records = await store.getByField('Weight', 'uid', uid);
      return records.map(record => this.create(record as WeightProps));
    }

    static async getByHeight(height: number): Promise<Weight[] | undefined>{
      const records = await store.getByField('Weight', 'height', height);
      return records.map(record => this.create(record as WeightProps));
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<WeightProps>[], options?: GetOptions<WeightProps>): Promise<Weight[]> {
        const records = await store.getByFields('Weight', filter, options);
        return records.map(record => this.create(record as WeightProps));
    }

    static create(record: WeightProps): Weight {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(
            record.id,
            record.netUid,
            record.uid,
            record.weights,
            record.height,
        );
        Object.assign(entity,record);
        return entity;
    }
}
