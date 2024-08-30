// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type BlockProps = Omit<Block, NonNullable<FunctionPropertyNames<Block>>| '_name'>;

export class Block implements Entity {

    constructor(
        
        id: string,
        height: bigint,
        eventCount: number,
        extrinsicCount: number,
        hash: string,
        parentHash: string,
        specVersion: number,
        timestamp: Date,
    ) {
        this.id = id;
        this.height = height;
        this.eventCount = eventCount;
        this.extrinsicCount = extrinsicCount;
        this.hash = hash;
        this.parentHash = parentHash;
        this.specVersion = specVersion;
        this.timestamp = timestamp;
        
    }

    public id: string;
    public height: bigint;
    public eventCount: number;
    public extrinsicCount: number;
    public hash: string;
    public parentHash: string;
    public specVersion: number;
    public timestamp: Date;
    

    get _name(): string {
        return 'Block';
    }

    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Block entity without an ID");
        await store.set('Block', id.toString(), this);
    }

    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Block entity without an ID");
        await store.remove('Block', id.toString());
    }

    static async get(id:string): Promise<Block | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Block entity without an ID");
        const record = await store.get('Block', id.toString());
        if (record) {
            return this.create(record as BlockProps);
        } else {
            return;
        }
    }

    static async getByHeight(height: bigint): Promise<Block[] | undefined>{
      const records = await store.getByField('Block', 'height', height);
      return records.map(record => this.create(record as BlockProps));
    }

    static async getByHash(hash: string): Promise<Block[] | undefined>{
      const records = await store.getByField('Block', 'hash', hash);
      return records.map(record => this.create(record as BlockProps));
    }

    static async getByTimestamp(timestamp: Date): Promise<Block[] | undefined>{
      const records = await store.getByField('Block', 'timestamp', timestamp);
      return records.map(record => this.create(record as BlockProps));
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<BlockProps>[], options?: GetOptions<BlockProps>): Promise<Block[]> {
        const records = await store.getByFields('Block', filter, options);
        return records.map(record => this.create(record as BlockProps));
    }

    static create(record: BlockProps): Block {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(
            record.id,
            record.height,
            record.eventCount,
            record.extrinsicCount,
            record.hash,
            record.parentHash,
            record.specVersion,
            record.timestamp,
        );
        Object.assign(entity,record);
        return entity;
    }
}
