import { getChainType } from "./utils";
import {
  MultichainContextType,
  SupportedChains,
  Chain,
  WalletContextType,
  SolanaChain,
  EVMChain,
  SupportedWallets,
  ChainType,
  ModalContextType,
} from "./types";
import MultichainWalletProvider from "./MultichainWalletProvider";
import useWallet from "./useWallet";
import useModal from "./useModal";
import { MultichainConnectedButton } from "./MultichainConnectedButton";
import { MultichainConnectButton } from "./MultichainConnectButton";
import { MultichainChainSelector } from "./MultichainChainSelector";
import useChain from "./useChain";
import useWalletAdapters from "./useWalletAdapters";

export {
  MultichainWalletProvider,
  MultichainConnectedButton,
  MultichainConnectButton,
  MultichainChainSelector,
  useWallet,
  useModal,
  getChainType,
  useChain,
  useWalletAdapters,
};

export type {
  MultichainContextType,
  SupportedChains,
  Chain,
  WalletContextType,
  SolanaChain,
  EVMChain,
  SupportedWallets,
  ChainType,
  ModalContextType,
};
