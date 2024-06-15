import type { OverrideBundleDefinition } from "@polkadot/types/types";

const definitions: OverrideBundleDefinition = {
  types: [
  ],
  rpc: {
  },
};

export default { typesBundle: { spec: { "node-subspace": definitions } } };
