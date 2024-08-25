import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import {
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
  const { method } = event.extrinsic.extrinsic.method;
  if (method === "register") return;
  const height = event.block.block.header.number.toNumber();
  const { data } = event.event;
  const account = data[0].toString();
  const module = data[1].toString();
  const amount = BigInt(data[2].toString());

  if (amount === ZERO) return;

  const netUid = 404;

  const eventRecord = DelegationEvent.create({
    id: `${height}-${account}-${module}`,
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

const removeAllDelegateBalanceRecords = async () => {
  const allRecords = await store.getByFields("DelegateBalance", []);
  const allIds = allRecords.map(record => record.id);
  await store.bulkRemove("DelegateBalance", allIds);
};

export async function fetchDelegations(block: SubstrateBlock): Promise<void> {
  if (!unsafeApi) return;

  const hash = block.block.header.hash.toString();
  const apiAt = await unsafeApi.at(hash);

  logger.info(`#${block.block.header.number.toNumber()}: fetchDelegations`);
  const height = block.block.header.number.toNumber();

  apiAt.query.subspaceModule.stakeTo.entries().then(async stakeTo => {
    const records: DelegateBalance[] = [];
    logger.info(`#${height}: syncStakedAmount`);
    for (const [key, value] of stakeTo) {
      const [account, module] = key.toHuman() as [string, string];
      const amount = BigInt(value.toString());

      if (amount === ZERO) continue;

      records.push(
          DelegateBalance.create({
            id: `${account}-${module}`,
            netUid: 404,
            lastUpdate: height,
            account,
            module,
            amount,
          })
      );
    }

    // await removeAllDelegateBalanceRecords();
    await store.bulkCreate("DelegateBalance", records);
  })

}
