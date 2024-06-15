import { SubstrateEvent } from "@subql/types";
import { Module } from "../types/models";

export async function handleModuleAdded(event: SubstrateEvent): Promise<void> {
    if (!event.extrinsic || !unsafeApi) return;

    const height = event.block.block.header.number.toNumber();
    const { block: { timestamp, block: {header: {hash}} }, event: { data }, extrinsic: { idx } } = event;

    const netUid = data[0].toJSON() as number;
    const uid = data[1].toJSON() as number;
    const key = data[2].toString();

    const id = `${netUid}-${uid}`;

    const apiAt = await unsafeApi.at(hash);

    const name = await apiAt.query.subspaceModule.name(netUid, uid);
    const address = await apiAt.query.subspaceModule.address(netUid, uid);

    const entity = Module.create({
        id,
        netUid,
        uid,
        key,
        name: name.toHuman() as string,
        address: address.toHuman() as string,
        registeredAt: height,
        timestamp,
        extrinsicId: idx
    });

    await entity.save();
}