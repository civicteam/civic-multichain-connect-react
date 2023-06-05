/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from "react";
import { WalletAdapterContextType } from "./types";
import { MultichainWalletAdapterPluginContext } from "./MultichainWalletAdapterPluginProvider";

const useWalletAdapters = (): WalletAdapterContextType => {
  return useContext(MultichainWalletAdapterPluginContext);
};

export default useWalletAdapters;
