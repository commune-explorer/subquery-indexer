import {SubstrateBlock} from "@subql/types";
import {Account, DelegateBalance} from "../types";
import {ZERO} from "../utils/consts";
import { hexToU8a } from '@polkadot/util';
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

  updateAllAccounts(block).then(() => {
      logger.info(`Finished fetching accounts at block #${height}`)
  });
}

async function updateAllAccounts(block: SubstrateBlock) {
    if (!unsafeApi) throw new Error("API not initialized");

    const height = block.block.header.number.toBigInt();
    const hash = block.block.header.hash.toString();
    const pageSize = 1000;
    let currentPage = "0x";
    while (true){
        // @ts-ignore
        const accountStorageKeys = await unsafeApi._rpcCore.provider.send('state_getKeysPaged', [
                '0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9',//account
                pageSize,
                currentPage,
                hash.toString()
            ]
            , false);

        // @ts-ignore
        unsafeApi._rpcCore.provider.send('state_queryStorageAt',
            [accountStorageKeys, hash.toString()]
            , false).then(async accountStorages => {

            let entities: Account[] = [];

            for (const [key, data] of accountStorages[0].changes) {
                const address = encodeAddress(hexToU8a(key).slice(32 + 16));
                const palletBalancesAccountData = hexToU8a(data).slice(16);
                const freeBalance = new DataView(palletBalancesAccountData.buffer).getBigUint64(0, true);

                const stakedBalance = (await DelegateBalance.getByAccount(address))?.reduce(
                    (accumulator, delegation) => accumulator + delegation.amount,
                    ZERO) ?? ZERO;

                const totalBalance = freeBalance + stakedBalance;

                entities.push(
                    Account.create({
                        id: address,
                        address,
                        createdAt: ZERO,
                        updatedAt: height,
                        balance_free: freeBalance,
                        balance_staked: stakedBalance,
                        balance_total: totalBalance,
                    })
                );
            }

            await store.bulkCreate("Account", entities);
        })

        if (accountStorageKeys.length < pageSize){
            break;
        }else{
            currentPage = accountStorageKeys[accountStorageKeys.length - 1];
        }
    }
}


async function* getAccountsIterator(block: SubstrateBlock): AsyncGenerator<[string, string]> {
  if (!unsafeApi) throw new Error("API not initialized");

    const hash = block.block.header.hash.toString();
    const pageSize = 1000;
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
    const accountStorages = await unsafeApi._rpcCore.provider.send('state_queryStorageAt',
        [accountStorageKeys, hash.toString()]
        , false);

    for (const [key, data] of accountStorages[0].changes) {
        const address = encodeAddress(hexToU8a(key).slice(32+16));
        const palletBalancesAccountData = hexToU8a(data).slice(16);
        const freeBalance = new DataView(palletBalancesAccountData.buffer).getBigUint64(0, true);
        yield [address, freeBalance.toString()]
    }

}
