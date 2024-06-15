import { SubstrateEvent } from "@subql/types";
import { Account, Transfer } from "../types/models";
import { decFreeBalance, incFreeBalance, initAccount } from "../helpers";

export async function handleTransfer(event: SubstrateEvent): Promise<void> {
  const {
    idx,
    event: { data },
    block: {
      block: {
        header: { number },
      },
    },
  } = event;

  const from = data[0].toString();
  const to = data[1].toString();
  const amount = BigInt(data[2].toString());

  const blockNumber = number.toBigInt();
  const extrinsicId = event.phase.asApplyExtrinsic.toPrimitive() as number;

  const entity = Transfer.create({
    id: `${blockNumber.toString()}-${idx}`,
    from,
    to,
    amount,
    blockNumber,
    extrinsicId,
  });

  await entity.save();
}

export async function handleDustLost(event: SubstrateEvent): Promise<void> {
  // Nothing to do at the moment
}

export async function handleDeposit(event: SubstrateEvent): Promise<void> {
  const height = event.block.block.header.number.toBigInt();
  const { data } = event.event;

  const address = data[0].toString();
  const amount = BigInt(data[1].toString());

  // logger.info(`Deposit ${address} balance = ${amount} block = ${height.toString()}`);

  await incFreeBalance(address, amount, height);
}

export async function handleWithdraw(event: SubstrateEvent): Promise<void> {
  const height = event.block.block.header.number.toBigInt();
  const { data } = event.event;

  const address = data[0].toString();
  const amount = BigInt(data[1].toString());

  // logger.info(`Withdraw ${address} balance = ${amount} block = ${height.toString()}`);

  await decFreeBalance(address, amount, height);
}

export async function handleEndowed(event: SubstrateEvent): Promise<void> {
  const height = event.block.block.header.number.toBigInt();
  const { data } = event.event;

  const address = data[0].toString();
  const initialBalance = BigInt(data[1].toString());

  // logger.info(`handleEndowed: address = ${address} balance = ${initialBalance} height = ${height}`);

  let account = await Account.get(address);
  if (!account) {
    // Account doesn't exist. Create a new record
    account = initAccount(address, height);
    account.balance_free = account.balance_total = initialBalance;
    await account.save();
  }
}
