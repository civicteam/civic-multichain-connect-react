import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, {
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useWalletClient } from "wagmi";
import {
  BaseChain,
  ModalContextType,
  SupportedChains,
  useChain,
} from "@civic/multichain-connect-react-core";

export const RainbowkitModalContext = React.createContext<ModalContextType>(
  {} as ModalContextType
);

const useWalletConnection = (
  selectedChain: BaseChain | undefined,
  openConnectModal: (() => void) | undefined,
  isConnected: boolean
) => {
  const [shouldOpenModal, setShouldOpenModal] = useState(false);

  useEffect(() => {
    const { type } = selectedChain || {};

    // Introduce a small delay to allow state updates to settle
    // User is disconnected before the selected chain is set to undefined resulting in the modal opening
    const timer = setTimeout(() => {
      console.log("isConnected", isConnected, "selectedChain", selectedChain);

      if (
        !isConnected &&
        type === SupportedChains.Ethereum &&
        selectedChain !== undefined
      ) {
        setShouldOpenModal(true);
      } else {
        setShouldOpenModal(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedChain, isConnected]);

  useEffect(() => {
    if (shouldOpenModal) {
      openConnectModal?.();
    }
  }, [shouldOpenModal, openConnectModal]);
};

// Create the context provider component
export default function RainbowkitModalProvider({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  const { openConnectModal } = useConnectModal();
  const { selectedChain } = useChain();
  const result = useWalletClient();

  useWalletConnection(
    selectedChain,
    openConnectModal,
    result.data ? true : false
  );

  const context = useMemo(
    () => ({
      openConnectModal,
    }),
    [openConnectModal]
  );

  return (
    <RainbowkitModalContext.Provider value={context}>
      {children}
    </RainbowkitModalContext.Provider>
  );
}
export const useRainbowkitAdapterModal = (): ModalContextType =>
  useContext(RainbowkitModalContext);
