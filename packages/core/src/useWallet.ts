import { useEffect, useState } from "react";
import { SupportedChains, WalletContextType } from "./types.js";
import useWalletAdapters from "./useWalletAdapters.js";

const useMultichainWallet = <
  T extends SupportedChains,
  S,
  E
>(): WalletContextType<T, S, E> => {
  const { getWalletAdapters } = useWalletAdapters<T, S, E>();
  const adapters = getWalletAdapters().map((a) => a.context);
  const adapter = adapters.find((a) => a?.connected || a?.connecting);

  return {
    wallet: adapter?.wallet,
    connected: adapter?.connected ?? false,
    connecting: adapter?.connecting ?? false,
    disconnect: adapter?.disconnect,
    chain: adapter?.chain,
  };
};

export default useMultichainWallet;
