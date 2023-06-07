import {
  SupportedChains,
  Chain,
  WalletContextType,
  ModalContextType,
  LabelEntry,
  BaseChain,
} from "./types";
import MultichainWalletProvider from "./MultichainWalletProvider";
import useWallet from "./useWallet";
import useModal from "./useModal";
import { MultichainConnectedButton } from "./MultichainConnectedButton";
import { MultichainConnectButton } from "./MultichainConnectButton";
import { MultichainChainSelector } from "./MultichainChainSelector";
import useChain from "./useChain";
import useWalletAdapters from "./useWalletAdapters";
import LabelProvider, { useLabel } from "./MultichainLabelProvider";

export {
  MultichainWalletProvider,
  MultichainConnectedButton,
  MultichainConnectButton,
  MultichainChainSelector,
  useWallet,
  useModal,
  useLabel,
  useChain,
  useWalletAdapters,
  LabelProvider,
  LabelEntry,
  SupportedChains,
};

export type { Chain, WalletContextType, ModalContextType, BaseChain };
