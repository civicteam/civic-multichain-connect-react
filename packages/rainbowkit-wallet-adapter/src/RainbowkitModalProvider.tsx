import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { ReactElement, useContext, useEffect, useMemo } from "react";
import { useWalletClient } from "wagmi";
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
  const { openConnectModal } = useConnectModal();
  const result = useWalletClient();
  const { selectedChain } = useChain();

  const context = useMemo(
    () => ({
      openConnectModal,
    }),
    [openConnectModal]
  );

  useEffect(() => {
    const { type } = selectedChain || {};
    // When reloading the page, the wallet client is not available immediately.
    // isConnected is false even when the wallet client is available.
    // Rely on the wallet client to determine if the user is connected.
    if (!result.data && type === SupportedChains.Ethereum) {
      openConnectModal?.();
    }
  }, [selectedChain, openConnectModal, result.data]);

  return (
    <RainbowkitModalContext.Provider value={context}>
      {children}
    </RainbowkitModalContext.Provider>
  );
}
export const useRainbowkitAdapterModal = (): ModalContextType =>
  useContext(RainbowkitModalContext);
