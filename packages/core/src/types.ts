import { ReactElement } from "react";
import chainIcons from "./icons.json";
import evmNetworks from "./evmNetworks.json";

export enum SupportedChains {
  Solana = "solana",
  Ethereum = "ethereum",
  Unknown = "unknown",
}

export type Wallet<
  T extends SupportedChains,
  S,
  E
> = T extends SupportedChains.Solana
  ? S
  : T extends SupportedChains.Ethereum
  ? E
  : never;

export type BaseChain = {
  id?: number;
  name: string;
  iconUrl?: string | (() => Promise<string>) | null;
  type: SupportedChains;
  testnet?: boolean;
};

export type Chain<
  T extends SupportedChains,
  S extends BaseChain,
  E extends BaseChain
> = T extends SupportedChains.Solana
  ? S
  : T extends SupportedChains.Ethereum
  ? E
  : never;

export interface WalletContextType<T extends SupportedChains, S, E> {
  chain?: T;
  wallet?: Wallet<T, S, E>;
  connected: boolean;
  disconnect: (() => void) | undefined;
}

export interface ChainContextType<
  T extends SupportedChains,
  S extends BaseChain,
  E extends BaseChain
> {
  selectedChain?: Chain<T, S, E>;
  chains: Chain<T, S, E>[];
  setSelectedChain: (chain?: Chain<T, S, E>) => void;
  openChainModal: (() => void) | undefined;
  setChains: (chains: Chain<T, S, E>[], type: SupportedChains) => void;
}

export interface ModalContextType {
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

export interface StorageContextType<T> {
  get: (key: string) => T | undefined;
  set: (key: string, item: T) => void;
  clear: (key: string) => void;
}

export type WalletAdpaterPlugin<T extends SupportedChains, S, E> = {
  context: WalletContextType<T, S, E> & ModalContextType;
  button: ReactElement;
};

export type WalletAdapterContextType<T extends SupportedChains, S, E> = {
  setWalletAdapter: (
    name: string,
    adapter: WalletAdpaterPlugin<T, S, E>
  ) => void;
  getWalletAdapter: (name: string) => WalletAdpaterPlugin<T, S, E>;
  getWalletAdapters: () => WalletAdpaterPlugin<T, S, E>[];
};

export type Icons = Record<string, string>;
export const icons: Icons = chainIcons as Icons;

export type NetworkConfig = {
  chainId: number;
  symbol?: string;
  network: string;
  isMainnet?: boolean;
  aliases?: string[];
};

type NetworkConfigs = Record<string, NetworkConfig>;
export const networkConfigs: NetworkConfigs = evmNetworks as NetworkConfigs;
