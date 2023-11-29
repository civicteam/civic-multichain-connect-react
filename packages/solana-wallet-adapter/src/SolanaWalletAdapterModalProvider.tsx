import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import {
  ModalContextType,
  useChain,
  SupportedChains,
} from "@civic/multichain-connect-react-core";

export const SolanaWalletAdapterModalContext =
  React.createContext<ModalContextType>({} as ModalContextType);

// Create the context provider component
export default function SolanaWalletAdapterModalProvider({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  const { wallet } = useWallet();
  const { setVisible, visible } = useWalletModal();
  const { selectedChain } = useChain();

  const openConnectModal = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  useEffect(() => {
    if (!wallet?.adapter.publicKey) {
      if (selectedChain?.type === SupportedChains.Solana) {
        setVisible(true);
        return;
      }

      setVisible(false);
    }
  }, [selectedChain, setVisible, wallet?.adapter.publicKey]);

  const context = useMemo(
    () => ({
      openConnectModal,
      connectModalOpen: visible,
    }),
    [openConnectModal]
  );

  return (
    <SolanaWalletAdapterModalContext.Provider value={context}>
      {children}
    </SolanaWalletAdapterModalContext.Provider>
  );
}
export const useSolanaWalletAdapterModal = (): ModalContextType =>
  useContext(SolanaWalletAdapterModalContext);
