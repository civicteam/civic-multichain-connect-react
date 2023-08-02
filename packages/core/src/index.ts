import {
  SupportedChains,
  Chain,
  WalletContextType,
  ModalContextType,
  LabelEntry,
  BaseChain,
} from "./types.js";
import MultichainWalletProvider from "./MultichainWalletProvider.js";
import useWallet from "./useWallet.js";
import useModal from "./useModal.js";
import { MultichainConnectedButton } from "./MultichainConnectedButton.js";
import { MultichainConnectButton } from "./MultichainConnectButton.js";
import useChain from "./useChain.js";
import useWalletAdapters from "./useWalletAdapters.js";
import LabelProvider, { useLabel } from "./MultichainLabelProvider.js";

export {
  MultichainWalletProvider,
  MultichainConnectedButton,
  MultichainConnectButton,
  useWallet,
  useModal,
  useLabel,
  useChain,
  useWalletAdapters,
  LabelProvider,
  LabelEntry,
  SupportedChains,
};

export type { Chain, BaseChain, WalletContextType, ModalContextType };
