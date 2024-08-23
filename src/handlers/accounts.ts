import { SubstrateBlock } from "@subql/types";
import {Account, DelegateBalance} from "../types";
import { ZERO } from "../utils/consts";
import {u8aToHex} from "@polkadot/util";
import {encodeAddress} from "@polkadot/util-crypto";
export let currentPageKey: string = "0x";

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
  let entities: Account[] = [];

  for await (const [address, freeBalance] of accountsIterator) {
    const freeBalanceBigInt = BigInt(freeBalance);

    const stakedBalance = (await DelegateBalance.getByAccount(address))?.reduce(
        (accumulator, delegation) => accumulator + delegation.amount,
        ZERO) ?? ZERO;

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

    const pageSize = 500;
    // @ts-ignore
    const accountStorageKeys = await unsafeApi._rpcCore.provider.send('state_getKeysPaged', [
            '0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9',//account
            pageSize,
            currentPageKey,
            hash.toString()
        ]
        , false);

    if (accountStorageKeys.length < pageSize){
        //no more entries, start at beginning...
        currentPageKey = "0x";
    }else{
        currentPageKey = accountStorageKeys[accountStorageKeys.length - 1];
    }

    // @ts-ignore
    const accounts = accountStorageKeys.map(key => encodeAddress(u8aToHex(key.slice(-32)), unsafeApi.registry.chainSS58));
    const accountInfos = await apiAt.query.system.account.multi(accounts);

    for (let i = 0; i < accounts.length; i++) {
        yield [accounts[i], accountInfos[i].data.free.toString()];
    }

}
