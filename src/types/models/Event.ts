// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type EventProps = Omit<Event, NonNullable<FunctionPropertyNames<Event>>| '_name'>;

export class Event implements Entity {

    constructor(
        
        id: string,
        blockNumber: bigint,
        extrinsicId: number,
        eventName: string,
        module: string,
        data: string,
    ) {
        this.id = id;
        this.blockNumber = blockNumber;
        this.extrinsicId = extrinsicId;
        this.eventName = eventName;
        this.module = module;
        this.data = data;
        
    }

    public id: string;
    public blockNumber: bigint;
    public extrinsicId: number;
    public eventName: string;
    public module: string;
    public data: string;
    

    get _name(): string {
        return 'Event';
    }

    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Event entity without an ID");
        await store.set('Event', id.toString(), this);
    }

    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Event entity without an ID");
        await store.remove('Event', id.toString());
    }

    static async get(id:string): Promise<Event | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Event entity without an ID");
        const record = await store.get('Event', id.toString());
        if (record) {
            return this.create(record as EventProps);
        } else {
            return;
        }
    }

    static async getByBlockNumber(blockNumber: bigint): Promise<Event[] | undefined>{
      const records = await store.getByField('Event', 'blockNumber', blockNumber);
      return records.map(record => this.create(record as EventProps));
    }

    static async getByExtrinsicId(extrinsicId: number): Promise<Event[] | undefined>{
      const records = await store.getByField('Event', 'extrinsicId', extrinsicId);
      return records.map(record => this.create(record as EventProps));
    }

    static async getByEventName(eventName: string): Promise<Event[] | undefined>{
      const records = await store.getByField('Event', 'eventName', eventName);
      return records.map(record => this.create(record as EventProps));
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<EventProps>[], options?: GetOptions<EventProps>): Promise<Event[]> {
        const records = await store.getByFields('Event', filter, options);
        return records.map(record => this.create(record as EventProps));
    }

    static create(record: EventProps): Event {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new this(
            record.id,
            record.blockNumber,
            record.extrinsicId,
            record.eventName,
            record.module,
            record.data,
        );
        Object.assign(entity,record);
        return entity;
    }
}
