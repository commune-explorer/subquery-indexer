import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import {
  Subnet,
  SubnetBurn,
  SubnetConsensus,
  SubnetParams,
} from "../types/models";

export async function handleNetworkAdded(event: SubstrateEvent): Promise<void> {
  if (!event.extrinsic) return;

  const {
    block: { timestamp },
    event: { data },
    extrinsic: { idx },
  } = event;

  const height = event.block.block.header.number.toNumber();

  const netUid = data[0].toJSON() as number;
  const name = data[1].toHuman() as string;
  const id = netUid.toString();

  let entity = await Subnet.get(id);
  if (entity) {
    await Subnet.remove(id);
  }

  entity = Subnet.create({
    id,
    netUid,
    extrinsicId: idx,
    registeredAt: height,
    timestamp,
    name,
  });

  await entity.save();
}

export async function handleNetworkRemoved(
  event: SubstrateEvent
): Promise<void> {
  const {
    event: { data },
  } = event;
  const id = data[0].toString();
  const entity = await Subnet.get(id);
  if (!entity) {
    logger.error(`Record for subnet # ${id} does not exist.`);
  } else {
    await Subnet.remove(id);
  }
}

export async function fetchSubnetBurns(block: SubstrateBlock): Promise<void> {
  if (!unsafeApi) return;
  const hash = block.block.header.hash.toString();
  const height = block.block.header.number.toNumber();
  const apiAt = await unsafeApi.at(hash);

  const burns = await apiAt.query.subspaceModule.burn.entries();

  const records: SubnetBurn[] = [];

  for (const [key, value] of burns) {
    const [netUid] = key.toHuman() as [number];
    const burn = BigInt(value.toJSON() as number);
    records.push(
      SubnetBurn.create({
        id: netUid.toString(),
        netUid,
        lastUpate: height,
        burn,
      })
    );
  }

  await store.bulkUpdate("SubnetBurn", records);
}

async function fetchSubnetParams(
  netUid: number,
  height: number,
  apiAt: any
): Promise<void> {
  const name = (
    await apiAt.query.subspaceModule.subnetNames(netUid)
  ).toHuman() as string;
  const founder = (await apiAt.query.subspaceModule.founder(netUid)).toString();
  const founder_share = (
    await apiAt.query.subspaceModule.founderShare(netUid)
  ).toJSON() as number;
  const immunity_period = (
    await apiAt.query.subspaceModule.immunityPeriod(netUid)
  ).toJSON() as number;
  const incentive_ratio = (
    await apiAt.query.subspaceModule.incentiveRatio(netUid)
  ).toJSON() as number;
  const max_allowed_uids = (
    await apiAt.query.subspaceModule.maxAllowedUids(netUid)
  ).toJSON() as number;
  const max_allowed_weights = (
    await apiAt.query.subspaceModule.maxAllowedWeights(netUid)
  ).toJSON() as number;
  const min_allowed_weights = (
    await apiAt.query.subspaceModule.minAllowedWeights(netUid)
  ).toJSON() as number;
  const max_stake = BigInt(0);
  const min_stake = BigInt(
    (await apiAt.query.subspaceModule.minStake(netUid)).toString()
  );
  const max_weight_age = BigInt(
    (await apiAt.query.subspaceModule.maxWeightAge(netUid)).toString()
  );
  const tempo = (
    await apiAt.query.subspaceModule.tempo(netUid)
  ).toJSON() as number;
  const trust_ratio = (
    await apiAt.query.subspaceModule.trustRatio(netUid)
  ).toJSON() as number;
  const maximum_set_weight_calls_per_epoch = (
    await apiAt.query.subspaceModule.maximumSetWeightCallsPerEpoch(netUid)
  ).toJSON() as number;
  const vote_mode = (
    await apiAt.query.governanceModule.voteModeSubnet(netUid)
  ).toString();
  const bonds_ma = BigInt(
    (await apiAt.query.subspaceModule.bondsMovingAverage(netUid)).toString()
  );

  const record = SubnetParams.create({
    id: `${netUid}`,
    netUid,
    lastUpdate: height,
    founder,
    founder_share,
    immunity_period,
    incentive_ratio,
    max_allowed_uids,
    max_allowed_weights,
    min_allowed_weights,
    max_stake,
    max_weight_age,
    min_stake,
    name,
    tempo,
    trust_ratio,
    maximum_set_weight_calls_per_epoch,
    vote_mode,
    bonds_ma,
  });
  await record.save();
}

export async function fetchAllSubnetParams(
  block: SubstrateBlock
): Promise<void> {
  if (!unsafeApi) return;
  const hash = block.block.header.hash.toString();
  const height = block.block.header.number.toNumber();
  const apiAt = await unsafeApi.at(hash);

  const keysRaw = await apiAt.query.subspaceModule.subnetNames.keys();

  for (const key of keysRaw) {
    const [netUid] = key.toHuman() as [number];
    await fetchSubnetParams(netUid, height, apiAt);
  }
}

export async function handleSubnetParamsUpdated(
  event: SubstrateEvent
): Promise<void> {
  if (!unsafeApi) return;
  const { data } = event.event;
  const netUid = data[0].toJSON() as number;
  const height = event.block.block.header.number.toNumber();
  const hash = event.block.block.header.hash.toString();
  const apiAt = await unsafeApi.at(hash);
  await fetchSubnetParams(netUid, height, apiAt);
}

async function fetchConsensusVars(
  netUid: number,
  height: number,
  apiAt: any
): Promise<void> {
  const incentiveRaw = await apiAt.query.subspaceModule.incentive(netUid);
  const incentive = JSON.stringify(incentiveRaw.toJSON());

  const dividendsRaw = await apiAt.query.subspaceModule.dividends(netUid);
  const dividends = JSON.stringify(dividendsRaw.toJSON());

  const emissionRaw = await apiAt.query.subspaceModule.emission(netUid);
  const emission = JSON.stringify(emissionRaw.toJSON());

  const record = SubnetConsensus.create({
    id: netUid.toString(),
    netUid,
    incentive,
    dividends,
    emission,
    lastUpdate: height.toString(),
  });

  await record.save();
}

export async function fetchAllConsensusVars(
  block: SubstrateBlock
): Promise<void> {
  if (!unsafeApi) return;
  const hash = block.block.header.hash.toString();
  const height = block.block.header.number.toNumber();
  const apiAt = await unsafeApi.at(hash);

  const keys = await apiAt.query.subspaceModule.dividends.keys();
  for (const key of keys) {
    const [netUid] = key.toHuman() as [number];
    await fetchConsensusVars(netUid, height, apiAt);
  }
}
