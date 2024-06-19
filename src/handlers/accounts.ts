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

// export async function updateAccountList(block: SubstrateBlock): Promise<void> {
//   const hash = block.block.header.hash.toString();
//   const height = block.block.header.number.toBigInt();

//   const apiAt = await unsafeApi?.at(hash);

//   if (!apiAt) {
//     logger.error("Failed to get API at the given block hash");
//     return;
//   }

//   const ts = Date.now();
//   const all_accounts_balances = await apiAt.query.system.account.entries();
//   const all_accounts_balances_valid = all_accounts_balances.map(
//     ([address, balance]) => {
//       return [(address.toHuman() as [string])[0], balance] as [
//         string,
//         typeof balance
//       ];
//     }
//   );

//   const accounts = all_accounts_balances_valid.map(([address, _]) => address);

//   let entities = await store.getByFields<Account>("Account", [
//     ["address", "in", accounts],
//   ]);

//   const entityMap = new Map<string, Account>();
//   entities.forEach((entity) => {
//     entityMap.set(entity.address, entity);
//   });

//   logger.info(`Fetching account balances took ${Date.now() - ts}ms`);
//   logger.info(
//     `Number of accounts fetched: ${all_accounts_balances_valid.length}`
//   );

//   const updatedEntities: Account[] = [];

//   for (const [address, balance] of all_accounts_balances_valid) {
//     let entity = entityMap.get(address.toString());

//     let create_entry: boolean = false;
//     if (entity == null) {
//       // If the key was not on the map, create the entity and set it to be
//       // saved at the end, instead of updating it.
//       entity = initAccount(address, BigInt(height));
//       create_entry = true;
//     }

//     // Update the balance value
//     const freeBalance =  BigInt(balance.data.free.toString());
//     entity.balance_free =freeBalance;
  
//     entity.balance_total = entity.balance_free + entity.balance_staked;
//     entity.updatedAt = height;

//     logger.debug(`Processing account ${address} with free balance: ${freeBalance}`);

//     if (create_entry) {
//       // If the key with stake didn't already exist, create it
//       entity.save();
//       logger.info(`Initialized new entity for account ${address}`);
//     } else {
//       // Otherwise, just defer to updating it
//       updatedEntities.push(entity);
//       logger.debug(`Will update existing entity for account ${address}`);
//     }
//   }

//   if (updatedEntities.length > 0) {
//     // Update the previously existing entities
//     await store.bulkUpdate("Account", updatedEntities);
//     logger.info(
//       `Updated ${updatedEntities.length} account entities at block #${height}`
//     );
//   } else {
//     logger.info(`No account entities to update at block #${height}`);
//   }
// }

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
