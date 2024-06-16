// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type LegitWhitelistProps = Omit<LegitWhitelist, NonNullable<FunctionPropertyNames<LegitWhitelist>>| '_name'>;

export class LegitWhitelist implements Entity {

    constructor(
        
        id: string,
        account: string,
        weight: number,
    ) {
        this.id = id;
        this.account = account;
        this.weight = weight;
        
    }

    public id: string;
    public account: string;
    public weight: number;
    

    get _name(): string {
        return 'LegitWhitelist';
    }

    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save LegitWhitelist entity without an ID");
        await store.set('LegitWhitelist', id.toString(), this);
    }

    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove LegitWhitelist entity without an ID");
        await store.remove('LegitWhitelist', id.toString());
    }

    static async get(id:string): Promise<LegitWhitelist | undefined>{
        assert((id !== null && id !== undefined), "Cannot get LegitWhitelist entity without an ID");
        const record = await store.get('LegitWhitelist', id.toString());
        if (record) {
            return this.create(record as LegitWhitelistProps);
        } else {
            return;
        }
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<LegitWhitelistProps>[], options?: GetOptions<LegitWhitelistProps>): Promise<LegitWhitelist[]> {
        const records = await store.getByFields('LegitWhitelist', filter, options);
        return records.map(record => this.create(record as LegitWhitelistProps));
    }

    static create(record: LegitWhitelistProps): LegitWhitelist {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(
            record.id,
            record.account,
            record.weight,
        );
        Object.assign(entity,record);
        return entity;
    }
}
