export type Account = string;

export type NominatorRecord = [string, number];

export type NeuronUid = number;
export type SubnetUid = number;

export type DelegateInfo = {
  delegate_ss58: Account;
  take: number;
  nominators: Array<NominatorRecord>;
  owner_ss58: Account;
  registrations: Array<SubnetUid>;
  validator_permits: Array<SubnetUid>;
  return_per_1000: number;
  total_daily_return: number;
};

export type AxonInfo = {
  block: number;
  version: number;
  ip: number;
  port: number;
  ip_type: number;
  protocol: number;
  placeholder1: number;
  placeholder2: number;
};

export type PrometheusInfo = {
  block: number;
  version: number;
  ip: number;
  port: number;
  ip_type: number;
};

export type NeuronInfoLite = {
  hotkey: Account;
  coldkey: Account;
  uid: NeuronUid;
  netuid: SubnetUid;
  active: boolean;
  axon_info: AxonInfo;
  prometheus_info: PrometheusInfo;
  stake: Array<[Account, number]>;
  rank: number;
  emission: number;
  incentive: number;
  trust: number;
  validator_trust: number;
  dividends: number;
  last_update: number;
  validator_permit: boolean;
  pruning_score: number;
};

export type NeuronInfo = NeuronInfoLite & {
  weights: Array<[number, number]>;
  bonds: Array<number>;
};

export type ValidatorInfo = {
  owner: string;
  validatorStake: bigint;
  amount: bigint;
  nominators: number;
  registrations: Array<SubnetUid>;
  validatorPermits: Array<SubnetUid>;
  totalDailyReturn: number;
};
