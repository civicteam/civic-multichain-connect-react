export enum ChainType {
  Solana = "solana",
  Ethereum = "ethereum",
}

export interface Chain {
  id: string;
  name: string;
  iconUrl?: string;
  testnet?: boolean;
  type: ChainType;
}

export interface MultichainModalContextType {
  chains: Chain[];
  registerChains: (chains: Chain[]) => void;
  selectedChain: Chain | null;
  setSelectedChain: (chain: Chain | null) => void;
  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;
}
