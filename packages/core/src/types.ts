import { Connection, PublicKey } from "@solana/web3.js";
import { ReactElement } from "react";

export interface ModalContextType {
  openConnectModal: (() => void) | undefined;
}

export interface ChainSelectorContextType {
  chain?: Chain;
  chains: Chain[];
  initialChain?: SupportedChains;
  setSelectedChain: (chain?: Chain) => void;
  openConnectModal: (() => void) | undefined;
}

export interface DisconnectContextType {
  disconnect: (() => void) | undefined;
}

export enum LabelEntry {
  CONNECT = "CONNECT",
  CONNECTED = "CONNECTED",
  DISCONNECT = "DISCONNECT",
  DISCONNECTED = "DISCONNECTED",
  SELECT_CHAIN = "SELECT_CHAIN",
  OTHER = "OTHER",
}

export type Labels = Record<LabelEntry, string>;

export interface LabelContextType {
  labels: Labels;
}

// TODO: Return the standard wallet type from wallet adapters once interface finaliswd
export interface Wallet {
  adapter: unknown;
  readyState: string;
}

export interface WalletContextState {
  wallet?: Wallet;
  publicKey?: PublicKey;
}

export interface EthersWallet {
  address: string;
}

export type SupportedWallets = WalletContextState | EthersWallet;

export interface WalletContextType {
  wallet?: SupportedWallets;
  connected: boolean;
  disconnect: (() => void) | undefined;
}

export type MultichainContextType = ChainSelectorContextType &
  WalletContextType;

export enum ChainType {
  Solana = "solana",
  Ethereum = "ethereum",
  Unknown = "unknown",
}

export type SolanaChain = {
  name: string;
  connection: Connection;
  iconUrl?: string | (() => Promise<string>) | null;
};

export type EVMChain = {
  id: number;
  name: string;
  iconUrl?: string | (() => Promise<string>) | null;
  iconBackground?: string;
};

export type SupportedChains = SolanaChain | EVMChain;

export type Chain = (EVMChain | SolanaChain) & { type: ChainType };

export type WalletAdpaterPlugin = {
  context: WalletContextType & ModalContextType;
  button: ReactElement;
};

export type WalletAdapterContextType = {
  setWalletAdapter: (name: string, plugin: WalletAdpaterPlugin) => void;
  getWalletAdapter: (name: string) => WalletAdpaterPlugin;
  getWalletAdapters: () => WalletAdpaterPlugin[];
};
