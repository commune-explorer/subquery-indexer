import { loadGenesisData } from "../helpers/genesis";

export async function handleGenesisData(): Promise<void> {
    await loadGenesisData();
}