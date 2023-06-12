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
  const { wallet, connect, select } = useWallet();
  const [canConnect, setcanConnect] = React.useState(false);
  const { setVisible } = useWalletModal();
  const { selectedChain } = useChain();

  const openConnectModal = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  // useEffect(() => {
  //   if (canConnect) {
  //     try {
  //       connect();
  //     } catch (e) {
  //       // DO NOTHING
  //     }
  //   }
  // }, [canConnect]);

  useEffect(() => {
    if (!wallet?.adapter.publicKey) {
      if (selectedChain?.type === SupportedChains.Solana) {
        setcanConnect(true);
        setVisible(true);
        return;
      }

      setVisible(false);
      setcanConnect(false);
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
