export enum ChainType {
  Solana = "solana",
  Ethereum = "ethereum",
}

export interface Chain {
  id: number;
  name: string;
  iconUrl?: string;
  testnet?: boolean;
  type: ChainType;
}

export type MultichainModalContextType = {
  // State
  chains: Chain[];
  selectedChain: Chain | null;
  connectionState: "connected" | "connecting" | "disconnected";
  // Actions
  registerChains: (newChains: Chain[]) => void;
  setSelectedChain: (chain: Chain | null) => void;
  setConnectionState: (
    state: "connected" | "connecting" | "disconnected"
  ) => void;
  _forceUpdate: number; // Used to force a re-render
};
