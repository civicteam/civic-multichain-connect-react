import React, { ReactElement, useCallback, useEffect, useMemo } from "react";
import { DisconnectContextType } from "./types.js";
import useChain from "./useChain.js";
import useWallet from "./useWallet.js";
import useWalletAdapters from "./useWalletAdapters.js";

export const MultichainWalletDisconnectContext =
  React.createContext<DisconnectContextType>({} as DisconnectContextType);

// Create the context provider component
export default function MultichainWalletDisconnectProvider({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  const { setSelectedChain, chains } = useChain();
  const { disconnect: disconnectWallet, chain } = useWallet();
  const { getWalletAdapters } = useWalletAdapters();

  const disconnect = useCallback(() => {
    setSelectedChain(undefined);
    disconnectWallet?.();
  }, [setSelectedChain, disconnectWallet]);

  useEffect(() => {
    // If the chain is not in the list of chains, disconnect the wallet
    if (chain && !chains.map((c) => c.type).includes(chain)) {
      disconnect();
    }
  }, [chains, disconnect, chain, getWalletAdapters]);

  const context = useMemo(
    () => ({
      // Figure out how to get the wallet from the adapter
      disconnect,
    }),
    [disconnect]
  );

  return (
    <MultichainWalletDisconnectContext.Provider value={context}>
      {children}
    </MultichainWalletDisconnectContext.Provider>
  );
}
