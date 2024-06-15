import { DelegateInfo } from "../model";
import { ZERO } from "../utils/consts";

export async function getBlockHash(height: number): Promise<string> {
  if (!unsafeApi) return "";
  const res = await unsafeApi.rpc.chain.getBlockHash(height);
  return res.toString();
}

export async function getStakedAmount(
  hotkey: string,
  coldkey: string,
  hash: string
): Promise<bigint> {
  if (!unsafeApi) return ZERO;
  const apiAt = await unsafeApi.at(hash);
  const res = await apiAt.query.subtensorModule.stake(hotkey, coldkey);
  if (res.isEmpty) {
    return ZERO;
  } else {
    return BigInt(res.toString());
  }
}

export async function getDelegatesInfoAt(
  height: number
): Promise<DelegateInfo[]> {
  if (height < 0) return [];
  const api = unsafeApi as any;
  const hash = await getBlockHash(height);
  const res_bytes = await api.rpc.delegateInfo.getDelegates(hash);
  if (res_bytes.isEmpty) {
    logger.error(`Failed to get delegates info. height = ${height.toString()}`);
    return [];
  }

  const res = api.createType("Vec<DelegateInfo>", res_bytes);
  const data = res.toJSON() as DelegateInfo[];
  return data;
}
