import { clusterApiUrl } from "@solana/web3.js";

export type Chain = {
  name: string;
  rpcEndpoint: string;
  iconUrl?: string | (() => Promise<string>) | null;
};

export const DEFAULT_ENDPOINT = clusterApiUrl("mainnet-beta");

export type SolanaConfigOptions = {
  walletConnectProjectId: string;
};

export enum WalletAdapterNetwork {
  Mainnet = "mainnet-beta",
  Testnet = "testnet",
  Devnet = "devnet",
}
