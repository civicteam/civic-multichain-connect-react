import { getChainType } from "./utils";
import { MultichainContextType, SupportedChains } from "./types";
import MultichainWalletProvider from "./MultichainWalletProvider";
import useWallet from "./useWallet";
import useModal from "./useModal";
import { MultichainConnectedButton } from "./MultichainConnectedButton";
import { MultichainConnectButton } from "./MultichainConnectButton";
import { MultichainChainSelector } from "./MultichainChainSelector";
import { VERSION } from "version";

export {
  MultichainWalletProvider,
  MultichainContextType,
  MultichainConnectedButton,
  MultichainConnectButton,
  MultichainChainSelector,
  useWallet,
  useModal,
  SupportedChains,
  getChainType,
};

console.log(VERSION);
