// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type ExtrinsicProps = Omit<Extrinsic, NonNullable<FunctionPropertyNames<Extrinsic>>| '_name'>;

export class Extrinsic implements Entity {

    constructor(
        
        id: string,
        module: string,
        method: string,
        blockNumber: bigint,
        extrinsicId: number,
        tip: bigint,
        version: number,
        signer: string,
        success: boolean,
        hash: string,
        args: string,
    ) {
        this.id = id;
        this.module = module;
        this.method = method;
        this.blockNumber = blockNumber;
        this.extrinsicId = extrinsicId;
        this.tip = tip;
        this.version = version;
        this.signer = signer;
        this.success = success;
        this.hash = hash;
        this.args = args;
        
    }

    public id: string;
    public module: string;
    public method: string;
    public blockNumber: bigint;
    public extrinsicId: number;
    public tip: bigint;
    public version: number;
    public signer: string;
    public success: boolean;
    public hash: string;
    public args: string;
    

    get _name(): string {
        return 'Extrinsic';
    }

    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Extrinsic entity without an ID");
        await store.set('Extrinsic', id.toString(), this);
    }

    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Extrinsic entity without an ID");
        await store.remove('Extrinsic', id.toString());
    }

    static async get(id:string): Promise<Extrinsic | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Extrinsic entity without an ID");
        const record = await store.get('Extrinsic', id.toString());
        if (record) {
            return this.create(record as ExtrinsicProps);
        } else {
            return;
        }
    }

    static async getByMethod(method: string): Promise<Extrinsic[] | undefined>{
      const records = await store.getByField('Extrinsic', 'method', method);
      return records.map(record => this.create(record as ExtrinsicProps));
    }

    static async getByBlockNumber(blockNumber: bigint): Promise<Extrinsic[] | undefined>{
      const records = await store.getByField('Extrinsic', 'blockNumber', blockNumber);
      return records.map(record => this.create(record as ExtrinsicProps));
    }

    static async getByExtrinsicId(extrinsicId: number): Promise<Extrinsic[] | undefined>{
      const records = await store.getByField('Extrinsic', 'extrinsicId', extrinsicId);
      return records.map(record => this.create(record as ExtrinsicProps));
    }

    static async getBySigner(signer: string): Promise<Extrinsic[] | undefined>{
      const records = await store.getByField('Extrinsic', 'signer', signer);
      return records.map(record => this.create(record as ExtrinsicProps));
    }

    static async getByHash(hash: string): Promise<Extrinsic[] | undefined>{
      const records = await store.getByField('Extrinsic', 'hash', hash);
      return records.map(record => this.create(record as ExtrinsicProps));
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<ExtrinsicProps>[], options?: GetOptions<ExtrinsicProps>): Promise<Extrinsic[]> {
        const records = await store.getByFields('Extrinsic', filter, options);
        return records.map(record => this.create(record as ExtrinsicProps));
    }

    static create(record: ExtrinsicProps): Extrinsic {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(
            record.id,
            record.module,
            record.method,
            record.blockNumber,
            record.extrinsicId,
            record.tip,
            record.version,
            record.signer,
            record.success,
            record.hash,
            record.args,
        );
        Object.assign(entity,record);
        return entity;
    }
}
