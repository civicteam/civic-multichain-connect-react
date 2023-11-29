import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { ReactElement, useContext, useEffect, useMemo } from "react";
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
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const { isConnected } = useAccount();
  const { selectedChain } = useChain();

  const context = useMemo(
    () => ({
      openConnectModal,
      connectModalOpen,
    }),
    [openConnectModal, connectModalOpen]
  );

  useEffect(() => {
    const { type } = selectedChain || {};
    if (!isConnected && type === SupportedChains.Ethereum) {
      openConnectModal?.();
    }
  }, [selectedChain, openConnectModal, isConnected]);

  return (
    <RainbowkitModalContext.Provider value={context}>
      {children}
    </RainbowkitModalContext.Provider>
  );
}
export const useRainbowkitAdapterModal = (): ModalContextType =>
  useContext(RainbowkitModalContext);
