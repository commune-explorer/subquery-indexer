import { SubstrateBlock } from "@subql/types";
import {Account, DelegateBalance} from "../types";
import { ZERO } from "../utils/consts";

export let currentPageKey: string | undefined = undefined;

const removeAllAccounts = async () => {
  const allRecords = await store.getByFields("Account", []);
  const allIds = allRecords.map(record => record.id);
  await store.bulkRemove("Account", allIds);
};

const removePageKeys = async () => {
  let count = 0;
  while (true) {
    const records = await store.getByFields("Account", []);
    const ids = records.map(({ id }) => id).filter((id) => id.startsWith('0x26aa'));
    if (ids.length === 0){
      break;
    }
      count += ids.length;
      await store.bulkRemove("Account", ids);
  }
};

export async function fetchAccounts(block: SubstrateBlock): Promise<void> {

  const height = block.block.header.number.toBigInt();

  logger.info(`Fetching accounts at block #${height}`);

  const accountsIterator = getAccountsIterator(block);
  const entities: Account[] = [];

  for await (const [address, freeBalance] of accountsIterator) {
    const freeBalanceBigInt = BigInt(freeBalance);
    const stakedBalances = (await DelegateBalance.getByAccount(address))?.map(val => val.amount);
    let stakedBalance = ZERO;
    if(stakedBalances){
      stakedBalances.forEach(balance => {
        stakedBalance += balance
      });
    }

    const totalBalance = freeBalanceBigInt + stakedBalance;

    entities.push(
      Account.create({
        id: address,
        address,
        createdAt: ZERO,
        updatedAt: height,
        balance_free: freeBalanceBigInt,
        balance_staked: stakedBalance,
        balance_total: totalBalance,
      })
    );
  }

  await store.bulkCreate("Account", entities);
}


async function* getAccountsIterator(block: SubstrateBlock): AsyncGenerator<[string, string]> {
  if (!unsafeApi) throw new Error("API not initialized");

  const hash = block.block.header.hash.toString();
  const apiAt = await unsafeApi.at(hash);

  const pageSize = 250;

  const accEntries = await apiAt.query.system.account.entriesPaged({
    args: [],
    pageSize,
    startKey: currentPageKey});

  if (accEntries.length < 250){
    //no more entries, start at beginning...
    currentPageKey = undefined;
  }else{
    currentPageKey = accEntries[accEntries.length - 1][0].toString();
  }

  for (let i = 0; i < accEntries.length - 1; i++) {
    const [key, accountInfo] = accEntries[i];
    yield [key.args[0].toString(), accountInfo.data.free.toString()];
  }

}
