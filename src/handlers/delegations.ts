import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import {
  Account,
  DelegateAction,
  DelegateBalance,
  DelegationEvent,
} from "../types"; 
import { ZERO } from "../utils/consts";
// import { DelegateAction } from "../types/enums";
// import { Account, DelegateBalance, DelegationEvent } from "../types/models";

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

  const accounts = Object.keys(userStakes);
  let entities = await store.getByFields<Account>("Account", [
    ["address", "in", accounts],
  ]);

  for (let i = 0; i < entities.length; ++i) {
    let entity = entities[i];
    const { address } = entity;
    entity.balance_staked = userStakes[address];
    entity.balance_total = entity.balance_free + entity.balance_staked;
    entity.updatedAt = BigInt(height);
  }

  await removeAllDelegationRecords();
  await store.bulkUpdate("DelegateBalance", records);
  await store.bulkUpdate("Account", entities);
}
