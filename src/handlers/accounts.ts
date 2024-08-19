import { SubstrateBlock } from "@subql/types";
import { Account, DelegateBalance } from "../types";
import { ZERO } from "../utils/consts";


const removeAllAccounts = async () => {
  const allRecords = await store.getByFields("Account", []);
  const allIds = allRecords.map(record => record.id);
  await store.bulkRemove("Account", allIds);
};

export async function fetchAccounts(block: SubstrateBlock): Promise<void> {
  const height = block.block.header.number.toBigInt();

  logger.info(`Fetching accounts at block #${height}`);
  // Fetch all DelegateBalance entries for staking module
  const allDelegateBalances = await DelegateBalance.getByFields([]);

  // Create a map of account addresses to their staked balances
  const stakedBalancesMap = new Map<string, bigint>();
  for (const delegateBalance of allDelegateBalances) {
    const currentBalance = stakedBalancesMap.get(delegateBalance.account) || ZERO;
    stakedBalancesMap.set(delegateBalance.account, currentBalance + delegateBalance.amount);
  }

  removeAllAccounts();
  logger.info(`#${height}: fetchAccounts`);

  const accountsIterator = getAccountsIterator(block);
  const entities: Account[] = [];

  for await (const [address, freeBalance] of accountsIterator) {
    const freeBalanceBigInt = BigInt(freeBalance);
    const stakedBalance = stakedBalancesMap.get(address) || ZERO;
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

  const allAccounts = await apiAt.query.system.account.keys();
  const queries = allAccounts.map((accountKey) => {
    return [apiAt.query.system.account, accountKey.args[0]] as [any, any];
  });

  const balances: any[] = await apiAt.queryMulti(queries);

  for (let i = 0; i < balances.length; i++) {
    const account = allAccounts[i]?.args[0];
    if (account && balances[i]?.data?.free) {
      yield [account.toString(), balances[i].data.free.toString()];
    }
  }
}