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
  orderBy?: number; // Add this line
}

export enum ConnectionState {
  Connected = "connected",
  Connecting = "connecting",
  Disconnected = "disconnected",
}

export type MultichainModalContextType = {
  chains: Chain[];
  selectedChain: Chain | null;
  walletConnections: {
    [key in ChainType]?: ConnectionState;
  };
  registerChains: (chains: Chain[]) => void;
  setSelectedChain: (chain: Chain | null) => void;
  setWalletConnection: (chainType: ChainType, state: ConnectionState) => void;
  getConnectionState: () => ConnectionState;
  _forceUpdate: number;
};
