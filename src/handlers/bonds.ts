import { SubstrateBlock } from "@subql/types";
import { NeuronBond } from "../types";

export async function fetchBonds(block: SubstrateBlock): Promise<void> {
  if (!unsafeApi) return;
  const hash = block.block.header.hash.toString();
  const height = block.block.header.number.toNumber();
  const apiAt = await unsafeApi.at(hash);

  const bondsRaw = await apiAt.query.subspaceModule.bonds.entries();
  const records: NeuronBond[] = [];

  for (const [key, value] of bondsRaw) {
    const [netUid, uid] = key.toHuman() as [number, number];
    const bonds = value.toJSON();
    records.push(
      NeuronBond.create({
        id: `${netUid}-${uid}`,
        lastUpdate: height,
        netUid,
        uid,
        value: JSON.stringify(bonds),
      })
    );
  }

  await store.bulkUpdate("NeuronBond", records);
}
