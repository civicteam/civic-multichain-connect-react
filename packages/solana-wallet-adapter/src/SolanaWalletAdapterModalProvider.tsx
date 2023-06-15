import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import React, { ReactElement, useCallback, useEffect, useMemo } from "react";
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
  const { setVisible } = useWalletModal();
  const { selectedChain, initialChain } = useChain();

  const openConnectModal = useCallback(() => {
  // Don't show modal if initial chain is a solana one
    if (initialChain?.type === SupportedChains.Solana) {
      return;
    }
    setVisible(true);
  }, [setVisible, initialChain]);

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
    }),
    [openConnectModal]
  );

  return (
    <SolanaWalletAdapterModalContext.Provider value={context}>
      {children}
    </SolanaWalletAdapterModalContext.Provider>
  );
}
