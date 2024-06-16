// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type SubnetConsensusProps = Omit<SubnetConsensus, NonNullable<FunctionPropertyNames<SubnetConsensus>>| '_name'>;

export class SubnetConsensus implements Entity {

    constructor(
        
        id: string,
        netUid: number,
        incentive: string,
        dividends: string,
        emission: string,
        lastUpdate: string,
    ) {
        this.id = id;
        this.netUid = netUid;
        this.incentive = incentive;
        this.dividends = dividends;
        this.emission = emission;
        this.lastUpdate = lastUpdate;
        
    }

    public id: string;
    public netUid: number;
    public incentive: string;
    public dividends: string;
    public emission: string;
    public lastUpdate: string;
    

    get _name(): string {
        return 'SubnetConsensus';
    }

    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save SubnetConsensus entity without an ID");
        await store.set('SubnetConsensus', id.toString(), this);
    }

    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove SubnetConsensus entity without an ID");
        await store.remove('SubnetConsensus', id.toString());
    }

    static async get(id:string): Promise<SubnetConsensus | undefined>{
        assert((id !== null && id !== undefined), "Cannot get SubnetConsensus entity without an ID");
        const record = await store.get('SubnetConsensus', id.toString());
        if (record) {
            return this.create(record as SubnetConsensusProps);
        } else {
            return;
        }
    }

    static async getByNetUid(netUid: number): Promise<SubnetConsensus[] | undefined>{
      const records = await store.getByField('SubnetConsensus', 'netUid', netUid);
      return records.map(record => this.create(record as SubnetConsensusProps));
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<SubnetConsensusProps>[], options?: GetOptions<SubnetConsensusProps>): Promise<SubnetConsensus[]> {
        const records = await store.getByFields('SubnetConsensus', filter, options);
        return records.map(record => this.create(record as SubnetConsensusProps));
    }

    static create(record: SubnetConsensusProps): SubnetConsensus {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(
            record.id,
            record.netUid,
            record.incentive,
            record.dividends,
            record.emission,
            record.lastUpdate,
        );
        Object.assign(entity,record);
        return entity;
    }
}
