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
  const { method } = event.extrinsic.extrinsic.method;
  if (method === "register") return;
  const height = event.block.block.header.number.toNumber();
  const { data } = event.event;
  const account = data[0].toString();
  const module = data[1].toString();
  const amount = BigInt(data[2].toString());

  if (amount === ZERO) return;

  const eventRecord = DelegationEvent.create({
    id: `${height}-${account}-${module}`,
    height,
    extrinsicId: event.extrinsic.idx.toString(), // Convert to string
    account,
    module,
    amount,
    action,
  });
  await eventRecord.save();

  const id = `${account}-${module}`;

  let balanceRecord = await DelegateBalance.get(id);
  if (!balanceRecord) {
    balanceRecord = DelegateBalance.create({
      id,
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

export async function syncNetWorth(block: SubstrateBlock): Promise<void> {
  if (!unsafeApi) return;

  const hash = block.block.header.hash.toString();
  const apiAt = await unsafeApi.at(hash);

  const stakeFrom = await apiAt.query.subspaceModule.stakeFrom.entries();
  const height = block.block.header.number.toNumber();

  const records: DelegateBalance[] = [];
  logger.info(`#${height}: syncStakedAmount`);

  const userStakes: Record<string, bigint> = {};

  for (const [key, value] of stakeFrom) {
    const [account, module] = key.toHuman() as [string, string];
    const amount = BigInt(value.toString());

    if (amount === ZERO) continue;

    records.push(
      DelegateBalance.create({
        id: `${account}-${module}`,
        lastUpdate: height,
        account,
        module,
        amount,
      })
    );
    userStakes[account] = (userStakes[account] ?? ZERO) + amount;
  }

  await removeAllDelegationRecords();
  await store.bulkUpdate("DelegateBalance", records);

  const accounts = Object.keys(userStakes);
  let entities = await store.getByFields<Account>("Account", []);

  // We check the user balances, as we need to know if they changed as well
  const balances = await apiAt.query.system.account.multi(accounts);
  // zip together the stakes and balances
  const usersFunds = accounts.map((account, index) => {
    return {
      address: account,
      balance: BigInt(balances[index].data.free.toString()),
      stake: userStakes[account],
    };
  });

  // Create a map of entities indexed by their address
  const entityMap = new Map<string, Account>();
  entities.forEach((entity) => {
    entityMap.set(entity.address, entity);
  });

  const updatedEntities: Account[] = [];

  for (const { address, stake, balance } of usersFunds) {
    let entity = entityMap.get(address);

    let create_entry: boolean = false;
    if (entity == null) {
      // If the key was not on the map, create the entity and set it to be
      // saved at the end, instead of updating it.
      entity = initAccount(address, BigInt(height));
      create_entry = true;
    }

    // Update the stake value
    entity.balance_staked = stake;
    entity.balance_total = balance + stake;
    entity.balance_free = balance;
    entity.updatedAt = BigInt(height);

    if (create_entry) {
      // If the key with stake didn't already exist, create it
      entity.save();
      logger.info(`Initialized new entity for account ${address}`);
    } else {
      // Otherwise, just defer to updating it
      updatedEntities.push(entity);
      logger.debug(`Will update existing entity for account ${address}`);
    }
  }

  if (updatedEntities.length > 0) {
    // Update the previously existing entities
    await store.bulkUpdate("Account", updatedEntities);
    logger.info(
      `Updated ${updatedEntities.length} account entities at block #${height}`
    );
  } else {
    logger.info(`No staked amount to update at block height #${height}`);
  }
}
