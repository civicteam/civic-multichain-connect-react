import { Connection } from "@solana/web3.js";
import { Chain as RainbowkitChain } from "@rainbow-me/rainbowkit";
import { Wallet as SolanaAdapterWallet } from "@solana/wallet-adapter-react";
import { Wallet as EthersWallet } from "ethers";

export interface ModalContextType {
  openConnectModal: (() => void) | undefined;
}

export interface ChainSelectorContextType {
  chain?: Chain;
  setSelectedChain: (chain?: Chain) => void;
}

export interface DisconnectContextType {
  disconnect: (() => void) | undefined;
}

export enum LabelEntry {
  CONNECT,
  CONNECTED,
  DISCONNECT,
  DISCONNECTED,
  SELECT_CHAIN,
}

export type Labels = Record<LabelEntry, string>;

export interface LabelContextType {
  labels: Labels;
}

export type SupportedWallets = SolanaAdapterWallet | EthersWallet;
export interface WalletContextType {
  wallet?: SupportedWallets;
  connected: boolean;
}

export type MultichainContextType = ModalContextType & WalletContextType;

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
export type Chain = (EVMChain | SolanaChain) & { type: ChainType };

// create a factory function that either creates a SolanaChain or am EVMChain. Solana should take in a connection and icon and EVMChain should accept a RainbowkitChain
export const createChain = {
  solana: (
    connection: Connection,
    iconUrl?: string | (() => Promise<string>) | null
  ): Chain => ({
    name: "solana",
    type: ChainType.Solana,
    connection,
    iconUrl,
  }),
  ethereum: (chain: EVMChain): Chain => ({
    ...chain,
    type: ChainType.Ethereum,
  }),
};
