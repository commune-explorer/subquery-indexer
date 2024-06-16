// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type SubnetParamsProps = Omit<SubnetParams, NonNullable<FunctionPropertyNames<SubnetParams>>| '_name'>;

export class SubnetParams implements Entity {

    constructor(
        
        id: string,
        netUid: number,
        lastUpdate: number,
        founder: string,
        founder_share: number,
        immunity_period: number,
        incentive_ratio: number,
        max_allowed_uids: number,
        max_allowed_weights: number,
        min_allowed_weights: number,
        max_weight_age: bigint,
        min_stake: bigint,
        name: string,
        tempo: number,
        trust_ratio: number,
        maximum_set_weight_calls_per_epoch: number,
        vote_mode: string,
        bonds_ma: bigint,
    ) {
        this.id = id;
        this.netUid = netUid;
        this.lastUpdate = lastUpdate;
        this.founder = founder;
        this.founder_share = founder_share;
        this.immunity_period = immunity_period;
        this.incentive_ratio = incentive_ratio;
        this.max_allowed_uids = max_allowed_uids;
        this.max_allowed_weights = max_allowed_weights;
        this.min_allowed_weights = min_allowed_weights;
        this.max_weight_age = max_weight_age;
        this.min_stake = min_stake;
        this.name = name;
        this.tempo = tempo;
        this.trust_ratio = trust_ratio;
        this.maximum_set_weight_calls_per_epoch = maximum_set_weight_calls_per_epoch;
        this.vote_mode = vote_mode;
        this.bonds_ma = bonds_ma;
        
    }

    public id: string;
    public netUid: number;
    public lastUpdate: number;
    public founder: string;
    public founder_share: number;
    public immunity_period: number;
    public incentive_ratio: number;
    public max_allowed_uids: number;
    public max_allowed_weights: number;
    public min_allowed_weights: number;
    public max_weight_age: bigint;
    public min_stake: bigint;
    public name: string;
    public tempo: number;
    public trust_ratio: number;
    public maximum_set_weight_calls_per_epoch: number;
    public vote_mode: string;
    public bonds_ma: bigint;
    

    get _name(): string {
        return 'SubnetParams';
    }

    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save SubnetParams entity without an ID");
        await store.set('SubnetParams', id.toString(), this);
    }

    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove SubnetParams entity without an ID");
        await store.remove('SubnetParams', id.toString());
    }

    static async get(id:string): Promise<SubnetParams | undefined>{
        assert((id !== null && id !== undefined), "Cannot get SubnetParams entity without an ID");
        const record = await store.get('SubnetParams', id.toString());
        if (record) {
            return this.create(record as SubnetParamsProps);
        } else {
            return;
        }
    }

    static async getByNetUid(netUid: number): Promise<SubnetParams[] | undefined>{
      const records = await store.getByField('SubnetParams', 'netUid', netUid);
      return records.map(record => this.create(record as SubnetParamsProps));
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<SubnetParamsProps>[], options?: GetOptions<SubnetParamsProps>): Promise<SubnetParams[]> {
        const records = await store.getByFields('SubnetParams', filter, options);
        return records.map(record => this.create(record as SubnetParamsProps));
    }

    static create(record: SubnetParamsProps): SubnetParams {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(
            record.id,
            record.netUid,
            record.lastUpdate,
            record.founder,
            record.founder_share,
            record.immunity_period,
            record.incentive_ratio,
            record.max_allowed_uids,
            record.max_allowed_weights,
            record.min_allowed_weights,
            record.max_weight_age,
            record.min_stake,
            record.name,
            record.tempo,
            record.trust_ratio,
            record.maximum_set_weight_calls_per_epoch,
            record.vote_mode,
            record.bonds_ma,
        );
        Object.assign(entity,record);
        return entity;
    }
}
