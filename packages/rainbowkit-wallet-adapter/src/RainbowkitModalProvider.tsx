import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import {
  ModalContextType,
  SupportedChains,
  useChain,
} from "@civic/multichain-connect-react-core";

export const RainbowkitModalContext = React.createContext<ModalContextType>(
  {} as ModalContextType
);

// Create the context provider component
export default function RainbowkitModalProvider({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  const [disconnectedAfterConnected, setDisconnectedAfterConnected] =
    useState(false);
  const { openConnectModal } = useConnectModal();
  const account = useAccount({
    onDisconnect() {
      // Keep track of whether the user disconnected after connecting
      setDisconnectedAfterConnected(true);
    },
  });
  const { selectedChain } = useChain();

  const context = useMemo(
    () => ({
      openConnectModal,
    }),
    [openConnectModal]
  );

  useEffect(() => {
    if (
      !account.isConnected &&
      selectedChain?.type === SupportedChains.Ethereum
    ) {
      // Suppress the rainbowkit modal showing once after disconnecting a connected wallet
      if (!disconnectedAfterConnected) {
        openConnectModal?.();
      } else {
        setDisconnectedAfterConnected(false);
      }
    }
  }, [selectedChain, openConnectModal, account.isConnected]);

  return (
    <RainbowkitModalContext.Provider value={context}>
      {children}
    </RainbowkitModalContext.Provider>
  );
}
