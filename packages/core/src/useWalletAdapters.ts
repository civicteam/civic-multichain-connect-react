/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from "react";
import { SupportedChains, WalletAdapterContextType } from "./types";
import { MultichainWalletAdapterPluginContext } from "./MultichainWalletAdapterPluginProvider";

const useWalletAdapters = <
  T extends SupportedChains,
  S,
  E
>(): WalletAdapterContextType<T, S, E> => {
  return useContext(MultichainWalletAdapterPluginContext);
};

export default useWalletAdapters;
