import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { initAccount } from "../helpers";
import { Account } from "../types";
import { ZERO } from "../utils/consts";

export async function fetchAccounts(block: SubstrateBlock): Promise<void> {
  if (!unsafeApi) return;
  const hash = block.block.header.hash.toString();
  const height = block.block.header.number.toBigInt();

  const apiAt = await unsafeApi?.at(hash);

  const records = await apiAt.query.system.account.entries();
  const entities: Account[] = [];
  for (const [key, value] of records) {
    const address = (key.toHuman() as [string])[0];
    const {
      data: { free },
    } = value.toJSON() as any;
    entities.push(
      Account.create({
        id: address,
        address,
        createdAt: ZERO,
        updatedAt: height,
        balance_free: BigInt(free),
        balance_staked: ZERO,
        balance_total: BigInt(free),
      })
    );
  }
  await store.bulkUpdate("Account", entities);
}

export async function updateAccountList(block: SubstrateBlock): Promise<void> {
  const hash = block.block.header.hash.toString();
  const height = block.block.header.number.toBigInt();

  const apiAt = await unsafeApi?.at(hash);

  if (!apiAt) {
    logger.error("Failed to get API at the given block hash");
    return;
  }

  const ts = Date.now();
  const all_accounts_balances = await apiAt.query.system.account.entries();
  const accounts = all_accounts_balances.map(([address, _]) =>
    address.toString()
  );
  let entities = await store.getByFields<Account>("Account", [
    ["address", "in", accounts],
  ]);

  const entityMap = new Map<string, Account>();
  entities.forEach((entity) => {
    entityMap.set(entity.address, entity);
  });

  logger.info(`Fetching account balances took ${Date.now() - ts}ms`);
  logger.info(`Number of accounts fetched: ${all_accounts_balances.length}`);

  const updatedEntities: Account[] = [];

  for (const [address, balance] of all_accounts_balances) {
    const freeBalance = balance.data.free.toString();
    const reservedBalance = balance.data.reserved.toString();

    logger.info(`Processing account ${address.toString()}`);
    logger.info(`Free balance: ${freeBalance}`);
    logger.info(`Reserved balance: ${reservedBalance}`);

    if (freeBalance === "0") {
      logger.warn(`Account ${address.toString()} has zero free balance`);
    }

    let entity = entityMap.get(address.toString());

    if (entity) {
      entity.balance_free = BigInt(freeBalance);
      entity.balance_total = BigInt(freeBalance) + BigInt(reservedBalance);
      entity.updatedAt = height;
      logger.info(`Updated existing entity for account ${address.toString()}`);
      updatedEntities.push(entity);
    } else {
      entity = initAccount(address.toString(), height);
      entity.balance_free = BigInt(freeBalance);
      entity.balance_total = BigInt(freeBalance) + BigInt(reservedBalance);
      entity.updatedAt = height;
      logger.info(`Initialized new entity for account ${address.toString()}`);
      updatedEntities.push(entity);
    }
  }

  if (updatedEntities.length === 0) {
    logger.info(`No account entities to update at block height ${height}`);
    return;
  }

  await store.bulkUpdate("Account", updatedEntities);
  logger.info(
    `#${height} - Updated ${updatedEntities.length} account entities`
  );
}

export async function handleNewAccount(event: SubstrateEvent): Promise<void> {
  const height = event.block.block.header.number.toBigInt();
  const address = event.event.data[0].toString();

  const record = await Account.getByAddress(address);

  if (record) {
    // Account already exists.
    return;
  }
  const entity = initAccount(address, height);
  await entity.save();
}

export async function handleDeadAccount(event: SubstrateEvent): Promise<void> {
  // Nothing to do at the moment
}
