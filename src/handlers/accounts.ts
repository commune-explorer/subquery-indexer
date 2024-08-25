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
  })
  // const accountsIterator = getAccountsIterator(block);
  // let entities: Account[] = [];
  //
  // for await (const [address, freeBalance] of accountsIterator) {
  //   const freeBalanceBigInt = BigInt(freeBalance);
  //
  //   const stakedBalance = (await DelegateBalance.getByAccount(address))?.reduce(
  //       (accumulator, delegation) => accumulator + delegation.amount,
  //       ZERO) ?? ZERO;
  //
  //   const totalBalance = freeBalanceBigInt + stakedBalance;
  //
  //   entities.push(
  //     Account.create({
  //       id: address,
  //       address,
  //       createdAt: ZERO,
  //       updatedAt: height,
  //       balance_free: freeBalanceBigInt,
  //       balance_staked: stakedBalance,
  //       balance_total: totalBalance,
  //     })
  //   );
  // }
  //
  // await store.bulkCreate("Account", entities);
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
        const accountAddresses = accountStorageKeys.map(key => encodeAddress(hexToU8a(key).slice(32 + 16)));

        const apiAt = await unsafeApi.at(hash);
        apiAt.query.system.account.multi(accountAddresses).then(async accountInfos => {
            let entities: Account[] = [];
            for (let i = 0; i < accountInfos.length; i++) {
                const accountInfo = accountInfos[i];
                const address = accountAddresses[i];
                const stakedBalance = (await DelegateBalance.getByAccount(address))?.reduce(
                    (accumulator, delegation) => accumulator + delegation.amount,
                    ZERO) ?? ZERO;
                const freeBalance = accountInfo.data.free.toBigInt();

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

        // todo: code below seems to be less memory heavy but the freeBalance bytes are not accurate if reservedBalance is present.
        // // @ts-ignore
        // unsafeApi._rpcCore.provider.send('state_queryStorageAt',
        //     [accountStorageKeys, hash.toString()]
        //     , false).then(async accountStorages => {
        //
        //     let entities: Account[] = [];
        //
        //     for (const [key, data] of accountStorages[0].changes) {
        //         const address = encodeAddress(hexToU8a(key).slice(32 + 16));
        //         const accountInfoBytes = hexToU8a(data);
        //
        //         const accountInfo = unsafeApi.registry.createType('AccountInfo', accountInfoBytes);
        //         const freeBalance = accountInfo.data.free.toBigInt();
        //         // const dataStart = 16;// free_balance
        //         // const bytes = accountInfoBytes.slice(dataStart, dataStart + 16);
        //         //
        //         // let freeBalance = BigInt(0);
        //         // // little-endian
        //         // for (let i = 0; i < bytes.length; i++) {
        //         //     freeBalance += BigInt(bytes[i]) << (BigInt(i) * BigInt(8));
        //         // }
        //
        //         const stakedBalance = (await DelegateBalance.getByAccount(address))?.reduce(
        //             (accumulator, delegation) => accumulator + delegation.amount,
        //             ZERO) ?? ZERO;
        //
        //         const totalBalance = freeBalance + stakedBalance;
        //
        //         entities.push(
        //             Account.create({
        //                 id: address,
        //                 address,
        //                 createdAt: ZERO,
        //                 updatedAt: height,
        //                 balance_free: freeBalance,
        //                 balance_staked: stakedBalance,
        //                 balance_total: totalBalance,
        //             })
        //         );
        //     }
        //
        //     await store.bulkCreate("Account", entities);
        // })

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
        const accountInfoBytes = hexToU8a(data);
        const dataStart = 16;// free_balance
        const bytes = accountInfoBytes.slice(dataStart, dataStart + 16);

        let freeBalance = BigInt(0);
        // little-endian
        for (let i = 0; i < bytes.length; i++) {
            freeBalance += BigInt(bytes[i]) << (BigInt(i) * BigInt(8));
        }
        yield [address, freeBalance.toString()]
    }

}
