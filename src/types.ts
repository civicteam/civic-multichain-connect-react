import { Connection } from "@solana/web3.js";
import { Chain as RainbowkitChain } from "@rainbow-me/rainbowkit";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Wallet as EthersWallet } from "ethers";
import { ChainProviderFn } from "wagmi";

export interface ModalContextType {
  openConnectModal: (() => void) | undefined;
}

export interface ChainSelectorContextType {
  chain?: Chain;
  chains: Chain[];
  setSelectedChain: (chain?: Chain) => void;
  openConnectModal: (() => void) | undefined;
  initialChain?: SupportedChains | undefined;
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

export type SupportedWallets = WalletContextState | EthersWallet;
export interface WalletContextType {
  wallet?: SupportedWallets;
  chain?: Chain;
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

export type EVMChain = RainbowkitChain;
export type SupportedChains = SolanaChain | EVMChain;
export type EVMChainsWithProviders = {
  chains: EVMChain[];
  providers: ChainProviderFn[];
};

export type Chain = (EVMChain | SolanaChain) & { type: ChainType };
