import { Wallet as SolanaWallet } from "@solana/wallet-adapter-react";
import { Wallet as EthersWallet } from "ethers";
import { ChainType, SupportedWallets } from "./types";

const isSolanaWallet = (wallet?: SupportedWallets): boolean => {
  return (wallet as SolanaWallet)?.adapter !== undefined;
};

const isEthersWallet = (wallet?: SupportedWallets): boolean => {
  return (wallet as EthersWallet)?.provider !== undefined;
};

export const getWalletChainType = (wallet?: SupportedWallets): ChainType => {
  if (isSolanaWallet(wallet)) return ChainType.Solana;
  if (isEthersWallet(wallet)) return ChainType.Ethereum;
  return ChainType.Unknown;
};
