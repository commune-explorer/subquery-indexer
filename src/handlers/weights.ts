import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { Weight } from "../types";

export async function handleWeightsSet(event: SubstrateEvent): Promise<void> {
  if (!event.extrinsic || !unsafeApi) return;

  const height = event.block.block.header.number.toNumber();
  const { hash } = event.block.block.header;

  const {
    event: { data },
  } = event;

  const netUid = data[0].toJSON() as number;
  const uid = data[1].toJSON() as number;
  const apiAt = await unsafeApi.at(hash);

  const weights = (
    await apiAt.query.subspaceModule.weights(netUid, uid)
  ).toJSON();

  const entity = Weight.create({
    id: `${netUid}-${uid}`,
    netUid,
    uid,
    height,
    weights: JSON.stringify(weights),
  });
  await entity.save();
}

export async function syncWeights(block: SubstrateBlock): Promise<void> {
  if (!unsafeApi) return;
  const hash = block.block.header.hash.toString();
  const height = block.block.header.number.toNumber();
  const apiAt = await unsafeApi.at(hash);

  while (true) {
    const records = await Weight.getByFields([["height", "!=", 0]]);
    if (records.length === 0) break;
    const ids = records.map(({ id }) => id);
    await store.bulkRemove("Weight", ids);
  }

  const weights = await apiAt.query.subspaceModule.weights.entries();
  const records: Weight[] = [];
  for (const [key, value] of weights) {
    const [strNetUid, strUid] = key.toHuman() as [string, string];
    const netUid = parseInt(strNetUid.replace(/,/g, ""));
    const uid = parseInt(strUid.replace(/,/g, ""));
    const weight = value.toJSON();
    records.push(
      Weight.create({
        id: `${netUid}-${uid}`,
        netUid,
        uid,
        height,
        weights: JSON.stringify(weight),
      })
    );
  }
  store.bulkUpdate("Weight", records);
}
