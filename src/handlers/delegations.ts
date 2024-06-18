import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import {
  Account,
  DelegateAction,
  DelegateBalance,
  DelegationEvent,
} from "../types";
import { initAccount } from "../helpers";
import { ZERO } from "../utils/consts";

export async function handleStakeAdded(event: SubstrateEvent): Promise<void> {
  await handleDelegation(event, DelegateAction.DELEGATE);
}

export async function handleStakeRemoved(event: SubstrateEvent): Promise<void> {
  await handleDelegation(event, DelegateAction.UNDELEGATE);
}

const handleDelegation = async (
  event: SubstrateEvent,
  action: DelegateAction
) => {
  if (!event.extrinsic) return;
  const { method, section } = event.extrinsic.extrinsic.method;
  if (method === "register") return;
  const height = event.block.block.header.number.toNumber();
  const { data } = event.event;
  const { args } = event.extrinsic.extrinsic;
  const account = data[0].toString();
  const module = data[1].toString();
  const amount = BigInt(data[2].toString());

  let netUid: number | undefined = undefined;
  if (section === "utility" && method === "batchAll") {
    const calls = (args[0] as any).toHuman();
    calls.forEach(({ args }: any) => {
      if (
        args.module_key === module &&
        BigInt(args.amount.replaceAll(",", "")) === amount
      ) {
        netUid = parseInt(args.netuid);
        logger.info(
          `height = ${height} netUid = ${netUid} module = ${module} account = ${account} amount = ${amount}`
        );
      }
    });
  } else {
    netUid = args[0].toJSON() as number;
  }

  if (amount === ZERO || netUid === undefined) return;

  const eventRecord = DelegationEvent.create({
    id: `${height}-${account}-${module}-${netUid}`,
    height,
    extrinsicId: event.extrinsic.idx,
    netUid,
    account,
    module,
    amount,
    action,
  });
  await eventRecord.save();

  const id = `${account}-${module}-${netUid}`;

  let balanceRecord = await DelegateBalance.get(id);
  if (!balanceRecord) {
    balanceRecord = DelegateBalance.create({
      id,
      netUid,
      account,
      module,
      amount: ZERO,
      lastUpdate: height,
    });
  }
  if (action === DelegateAction.DELEGATE) balanceRecord.amount += amount;
  else {
    balanceRecord.amount -= amount;
    if (balanceRecord.amount < ZERO) balanceRecord.amount = ZERO;
  }
  if (balanceRecord.amount === ZERO) {
    await store.remove("DelegateBalance", id);
    return;
  }
  balanceRecord.lastUpdate = height;
  await balanceRecord.save();
};

const removeAllDelegationRecords = async () => {
  while (true) {
    const records = await DelegateBalance.getByFields([["module", "!=", ""]]);
    if (records.length === 0) break;
    const ids = records.map(({ id }) => id);
    await store.bulkRemove("DelegateBalance", ids);
    logger.info(`remove ${ids.length} items`);
  }
};

export async function syncStakedAmount(block: SubstrateBlock): Promise<void> {
  if (!unsafeApi) return;

  const hash = block.block.header.hash.toString();
  const apiAt = await unsafeApi.at(hash);

  const stakeFrom = await apiAt.query.subspaceModule.stakeFrom.entries();
  const height = block.block.header.number.toNumber();

  const records: DelegateBalance[] = [];
  logger.info(`#${height}: syncStakedAmount`);

  const userStakes: Record<string, bigint> = {};

  for (const [key, value] of stakeFrom) {
    const [netUid, module] = key.toHuman() as [number, string];

    const stakers = value.toJSON() as Record<string, number>;

    for (const [account, amount] of Object.entries(stakers)) {
      if (!amount) continue;
      records.push(
        DelegateBalance.create({
          id: `${account}-${module}-${netUid}`,
          netUid,
          lastUpdate: height,
          account,
          module,
          amount: BigInt(amount),
        })
      );
      userStakes[account] = (userStakes[account] ?? ZERO) + BigInt(amount);
    }
  }

  await removeAllDelegationRecords();
  await store.bulkUpdate("DelegateBalance", records);

  const accounts = Object.keys(userStakes);
  let entities = await store.getByFields<Account>("Account", [
    ["address", "in", accounts],
  ]);

  // Create a map of entities indexed by their address
  const entityMap = new Map<string, Account>();
  entities.forEach((entity) => {
    entityMap.set(entity.address, entity);
  });

  const updatedEntities: Account[] = [];

  for (const [address, stake] of Object.entries(userStakes)) {
    let entity = entityMap.get(address);
    // If the key with stake already exists
    if (entity) {
      entity.balance_staked = stake;
      entity.balance_total = entity.balance_free + entity.balance_staked;
      entity.updatedAt = BigInt(height);
      updatedEntities.push(entity);
    } else {
      // If it doesn't, that means it has to have 0 balance, and we just add the stake
      
      // Create new entity if it doesn't exist
      entity = initAccount(address, BigInt(height));
      entity.balance_staked = stake;
      entity.balance_total = stake;
      entity.updatedAt = BigInt(height);
      entity.save();
    }
  }

  if (updatedEntities.length > 0) {
    await store.bulkUpdate("Account", updatedEntities);
  }
}
