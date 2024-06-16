// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type GlobalParamsProps = Omit<GlobalParams, NonNullable<FunctionPropertyNames<GlobalParams>>| '_name'>;

export class GlobalParams implements Entity {

    constructor(
        
        id: string,
        lastUpdate: number,
        timestamp: Date,
        burn_rate: number,
        max_name_length: number,
        min_name_length: number,
        max_allowed_subnets: number,
        max_allowed_modules: number,
        max_registrations_per_block: number,
        max_allowed_weights: number,
        min_burn: bigint,
        max_burn: bigint,
        min_stake: bigint,
        floor_delegation_fee: number,
        min_weight_stake: bigint,
        target_registrations_per_interval: number,
        target_registrations_interval: number,
        adjustment_alpha: bigint,
        unit_emission: bigint,
        curator: string,
        subnet_stake_threshold: number,
        proposal_cost: bigint,
        proposal_expiration: number,
        proposal_participation_threshold: number,
        general_subnet_application_cost: bigint,
        floor_founder_share: number,
    ) {
        this.id = id;
        this.lastUpdate = lastUpdate;
        this.timestamp = timestamp;
        this.burn_rate = burn_rate;
        this.max_name_length = max_name_length;
        this.min_name_length = min_name_length;
        this.max_allowed_subnets = max_allowed_subnets;
        this.max_allowed_modules = max_allowed_modules;
        this.max_registrations_per_block = max_registrations_per_block;
        this.max_allowed_weights = max_allowed_weights;
        this.min_burn = min_burn;
        this.max_burn = max_burn;
        this.min_stake = min_stake;
        this.floor_delegation_fee = floor_delegation_fee;
        this.min_weight_stake = min_weight_stake;
        this.target_registrations_per_interval = target_registrations_per_interval;
        this.target_registrations_interval = target_registrations_interval;
        this.adjustment_alpha = adjustment_alpha;
        this.unit_emission = unit_emission;
        this.curator = curator;
        this.subnet_stake_threshold = subnet_stake_threshold;
        this.proposal_cost = proposal_cost;
        this.proposal_expiration = proposal_expiration;
        this.proposal_participation_threshold = proposal_participation_threshold;
        this.general_subnet_application_cost = general_subnet_application_cost;
        this.floor_founder_share = floor_founder_share;
        
    }

    public id: string;
    public lastUpdate: number;
    public timestamp: Date;
    public burn_rate: number;
    public max_name_length: number;
    public min_name_length: number;
    public max_allowed_subnets: number;
    public max_allowed_modules: number;
    public max_registrations_per_block: number;
    public max_allowed_weights: number;
    public min_burn: bigint;
    public max_burn: bigint;
    public min_stake: bigint;
    public floor_delegation_fee: number;
    public min_weight_stake: bigint;
    public target_registrations_per_interval: number;
    public target_registrations_interval: number;
    public adjustment_alpha: bigint;
    public unit_emission: bigint;
    public curator: string;
    public subnet_stake_threshold: number;
    public proposal_cost: bigint;
    public proposal_expiration: number;
    public proposal_participation_threshold: number;
    public general_subnet_application_cost: bigint;
    public floor_founder_share: number;
    

    get _name(): string {
        return 'GlobalParams';
    }

    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save GlobalParams entity without an ID");
        await store.set('GlobalParams', id.toString(), this);
    }

    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove GlobalParams entity without an ID");
        await store.remove('GlobalParams', id.toString());
    }

    static async get(id:string): Promise<GlobalParams | undefined>{
        assert((id !== null && id !== undefined), "Cannot get GlobalParams entity without an ID");
        const record = await store.get('GlobalParams', id.toString());
        if (record) {
            return this.create(record as GlobalParamsProps);
        } else {
            return;
        }
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<GlobalParamsProps>[], options?: GetOptions<GlobalParamsProps>): Promise<GlobalParams[]> {
        const records = await store.getByFields('GlobalParams', filter, options);
        return records.map(record => this.create(record as GlobalParamsProps));
    }

    static create(record: GlobalParamsProps): GlobalParams {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(
            record.id,
            record.lastUpdate,
            record.timestamp,
            record.burn_rate,
            record.max_name_length,
            record.min_name_length,
            record.max_allowed_subnets,
            record.max_allowed_modules,
            record.max_registrations_per_block,
            record.max_allowed_weights,
            record.min_burn,
            record.max_burn,
            record.min_stake,
            record.floor_delegation_fee,
            record.min_weight_stake,
            record.target_registrations_per_interval,
            record.target_registrations_interval,
            record.adjustment_alpha,
            record.unit_emission,
            record.curator,
            record.subnet_stake_threshold,
            record.proposal_cost,
            record.proposal_expiration,
            record.proposal_participation_threshold,
            record.general_subnet_application_cost,
            record.floor_founder_share,
        );
        Object.assign(entity,record);
        return entity;
    }
}
