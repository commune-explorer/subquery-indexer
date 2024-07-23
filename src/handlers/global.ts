import { SubstrateBlock, SubstrateEvent } from "@subql/types";
import { GlobalParams } from "../types";

export async function fetchGlobalParameters(
  block: SubstrateBlock
): Promise<void> {
  if (!unsafeApi) return;
  const hash = block.block.header.hash.toString();
  const apiAt = await unsafeApi.at(hash);
  const height = block.block.header.number.toNumber();
  const { timestamp } = block;

  logger.info(`Fetching global parameters: height = ${height}`);

  const burn_rate = (
    await apiAt.query.subspaceModule.burnRate()
  ).toJSON() as number;
  const max_name_length = (
    await apiAt.query.subspaceModule.maxNameLength()
  ).toJSON() as number;
  const min_name_length = (
    await apiAt.query.subspaceModule.minNameLength()
  ).toJSON() as number;
  const max_allowed_subnets = (
    await apiAt.query.subspaceModule.maxAllowedSubnets()
  ).toJSON() as number;
  const max_allowed_modules = (
    await apiAt.query.subspaceModule.maxAllowedModules()
  ).toJSON() as number;
  const max_registrations_per_block = (
    await apiAt.query.subspaceModule.maxRegistrationsPerBlock()
  ).toJSON() as number;
  const max_allowed_weights = (
    await apiAt.query.subspaceModule.maxAllowedWeightsGlobal()
  ).toJSON() as number;
  const min_burn = BigInt(
    (await apiAt.query.subspaceModule.minBurn()).toJSON() as number
  );
  const max_burn = BigInt(
    (await apiAt.query.subspaceModule.maxBurn()).toJSON() as number
  );
  const min_stake = BigInt(0);
  const floor_delegation_fee = (
    await apiAt.query.subspaceModule.floorDelegationFee()
  ).toJSON() as number;
  const min_weight_stake = BigInt(
    (await apiAt.query.subspaceModule.minWeightStake()).toJSON() as number
  );
  const target_registrations_per_interval = (
    await apiAt.query.subspaceModule.targetRegistrationsPerInterval()
  ).toJSON() as number;
  const target_registrations_interval = (
    await apiAt.query.subspaceModule.targetRegistrationsInterval()
  ).toJSON() as number;
  const adjustment_alpha = BigInt(
    (await apiAt.query.subspaceModule.adjustmentAlpha()).toJSON() as number
  );
  const unit_emission = BigInt(
    (await apiAt.query.subspaceModule.unitEmission()).toJSON() as number
  );
  const curator = (await apiAt.query.subspaceModule.curator()).toString();
  const subnet_stake_threshold = (
    await apiAt.query.subspaceModule.subnetStakeThreshold()
  ).toJSON() as number;
  const proposal_cost = BigInt(
    (await apiAt.query.subspaceModule.proposalCost()).toJSON() as number
  );
  const proposal_expiration = (
    await apiAt.query.subspaceModule.proposalExpiration()
  ).toJSON() as number;
  const proposal_participation_threshold = (
    await apiAt.query.subspaceModule.proposalParticipationThreshold()
  ).toJSON() as number;
  const general_subnet_application_cost = BigInt(
    (
      await apiAt.query.subspaceModule.generalSubnetApplicationCost()
    ).toJSON() as number
  );
  const floor_founder_share = (
    await apiAt.query.subspaceModule.floorFounderShare()
  ).toJSON() as number;

  const globalParams = GlobalParams.create({
    id: "global-params",
    lastUpdate: height,
    timestamp,
    burn_rate,
    max_name_length,
    min_name_length,
    max_allowed_subnets,
    max_allowed_modules,
    max_registrations_per_block,
    max_allowed_weights,
    min_burn,
    max_burn,
    min_stake,
    floor_delegation_fee,
    min_weight_stake,
    target_registrations_per_interval,
    target_registrations_interval,
    adjustment_alpha,
    unit_emission,
    curator,
    subnet_stake_threshold,
    proposal_cost,
    proposal_expiration,
    proposal_participation_threshold,
    general_subnet_application_cost,
    floor_founder_share,
  });

  await globalParams.save();
}

export async function handleGlobalParametersUpdated(
  event: SubstrateEvent
): Promise<void> {
  await fetchGlobalParameters(event.block);
}
