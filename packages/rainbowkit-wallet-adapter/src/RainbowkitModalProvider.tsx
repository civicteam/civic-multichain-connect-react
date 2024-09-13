import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, {
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  BaseChain,
  ModalContextType,
  SupportedChains,
  useChain,
  useWallet,
} from "@civic/multichain-connect-react-core";

export const RainbowkitModalContext = React.createContext<ModalContextType>(
  {} as ModalContextType
);

const useWalletConnection = (
  selectedChain: BaseChain | undefined,
  openConnectModal: (() => void) | undefined,
  isConnected: boolean,
  isConnecting: boolean
) => {
  const shouldOpenModalRef = useRef(false);

  useEffect(() => {
    const { type } = selectedChain || {};

    shouldOpenModalRef.current =
      !isConnected &&
      !isConnecting &&
      type === SupportedChains.Ethereum &&
      selectedChain !== undefined;

    if (shouldOpenModalRef.current) {
      openConnectModal?.();
    }
  }, [selectedChain, isConnected, isConnecting, openConnectModal]);
};

// Create the context provider component
export default function RainbowkitModalProvider({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  const { openConnectModal } = useConnectModal();
  const { selectedChain } = useChain();
  const { connected, connecting } = useWallet();

  useWalletConnection(selectedChain, openConnectModal, connected, connecting);

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
