import { Account } from "../types";
import { ZERO } from "../utils/consts";
import { initAccount } from "./accounts";

export async function incFreeBalance(
  address: string,
  amount: bigint,
  height: bigint
): Promise<void> {
  let entity = await Account.get(address);
  if (!entity) {
    entity = initAccount(address, height);
  }

  if (!(entity.createdAt === height && entity.balance_free !== ZERO)) {
    entity.updatedAt = height;
    entity.balance_free += amount;
    entity.balance_total += amount;
  }

  await entity.save();
}

export async function decFreeBalance(
  address: string,
  amount: bigint,
  height: bigint
): Promise<void> {
  let entity = await Account.get(address);

  if (!entity) return;

  let dec = entity.balance_free < amount ? entity.balance_free : amount;

  entity.updatedAt = height;
  entity.balance_free -= dec;
  entity.balance_total -= dec;

  await entity.save();
}
