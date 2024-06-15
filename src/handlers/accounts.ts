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

  if (!apiAt) return;
  const accountEntities: Array<Account> = [];

  const start = Date.now();

  let offset = 0;
  while (true) {
    let records = await store.getByFields<Account>(
      "Account",
      [["address", "!=", ""]],
      { offset }
    );
    const len = records.length;
    logger.info(`offset = ${offset} fetched ${len} account records`);
    if (len === 0) break;
    const addresses = records.map((item) => item.address);
    const ts = Date.now();
    const accountsData = await apiAt.query.system.account.multi(addresses);
    logger.info(`fetching account balances took ${Date.now() - ts}ms`);
    for (let i = 0; i < records.length; ++i) {
      let record = records[i];
      const {
        data: { free },
      } = accountsData[i].toJSON() as any;
      const balance_free = BigInt(free);
      if (record.balance_free === balance_free) continue;
      record.balance_free = balance_free;
      record.balance_total = record.balance_staked + balance_free;
      record.updatedAt = height;
      accountEntities.push(record);
    }
    offset += len;
  }

  await store.bulkUpdate("Account", accountEntities);
  logger.info(`#${height} updating ${accountEntities.length} account entities`);
  logger.info(`#${height} updateAccoutList: ${Date.now() - start}ms`);
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
