import React, { ReactElement, useCallback, useEffect, useMemo } from "react";
import { DisconnectContextType } from "./types";
import useChain from "./useChain";
import useWallet from "./useWallet";

export const MultichainWalletDisconnectContext =
  React.createContext<DisconnectContextType>({} as DisconnectContextType);

// Create the context provider component
export default function MultichainWalletDisconnectProvider({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  const { setSelectedChain } = useChain();
  const { connected, disconnect: walletDisconnect } = useWallet();

  const disconnect = useCallback(() => {
    setSelectedChain(undefined);
  }, [setSelectedChain, walletDisconnect]);

  useEffect(() => {
    if (!connected) {
      disconnect();
    }
  }, [connected, disconnect]);

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
