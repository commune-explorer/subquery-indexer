import {SubstrateBlock} from "@subql/types";
import {Extrinsic, Event} from "../types";

export async function fetchExtrinsics(block: SubstrateBlock): Promise<void> {

  const height = block.block.header.number.toBigInt();

  logger.info(`Fetching extrinsics and events at block #${height}`);

  indexExtrinsicsAndEvents(block).then(() => {
      logger.info(`Finished fetching extrinsics and events at block #${height}`)
  });
}
const formattedNumber = (num: number) => num < 10 ? `000${num}` : num < 100 ? `00${num}` : num < 1000 ? `0${num}` : `${num}`;

async function indexExtrinsicsAndEvents(block: SubstrateBlock) {
    if (!unsafeApi) throw new Error("API not initialized");

    const height = block.block.header.number.toBigInt();
    const blockHeight = block.block.header.number.toString();
    const extrinsics = block.block.extrinsics;
    const events = block.events;

    let eventEntities: Event[] = [];
    for (const [index, event] of events.entries()) {
        const eventid = `${blockHeight}-${formattedNumber(index)}`;
        eventEntities.push(Event.create({
            id: eventid,
            blockNumber: height,
            extrinsicId: event.phase.isApplyExtrinsic ? event.phase.asApplyExtrinsic.toNumber() : -1,
            eventName: event.event.method,
            module: event.event.section,
            data: JSON.stringify(event.event.data)
        }))
    }
    await store.bulkCreate("Event", eventEntities);

    let entities: Extrinsic[] = [];
    for (const [index, extrinsic] of extrinsics.entries()) {
        const extrinsicid = `${blockHeight}-${formattedNumber(index)}`;
        const account = extrinsic.signer.toString();

        const extrinsicEvents = events.filter(({phase}) =>  phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(index)).map(({event}) => event);
        const success = extrinsicEvents.some((event) => event.section === 'system' && event.method === 'ExtrinsicSuccess');


        const extrinsicHash = extrinsic.hash.toString();

        entities.push(Extrinsic.create({
            id: extrinsicid,
            module: extrinsic.method.section,
            method: extrinsic.method.method,

            blockNumber: height,
            extrinsicId: index,

            tip: extrinsic.tip.toBigInt(),
            version: extrinsic.version,

            signer: account,
            success: success,
            hash: extrinsicHash,

            args: JSON.stringify(extrinsic.args)
        }
        ))


    }
    await store.bulkCreate("Extrinsic", entities);


}

