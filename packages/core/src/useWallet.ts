/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect } from "react";
import { WalletContextType } from "./types";
import useWalletAdapters from "./useWalletAdapters";

const useMultichainWallet = (): WalletContextType => {
  const { getWalletAdapters } = useWalletAdapters();
  const adapters = getWalletAdapters().map((a) => a.context);
  const adapter = adapters.find((a) => a?.connected);

  return {
    wallet: adapter?.wallet,
    connected: adapter?.connected ?? false,
    disconnect: adapter?.disconnect,
  };
};

export default useMultichainWallet;
