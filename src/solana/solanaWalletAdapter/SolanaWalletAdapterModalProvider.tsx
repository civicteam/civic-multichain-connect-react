import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import React, { ReactElement, useCallback, useEffect, useMemo } from "react";
import { ChainType, ModalContextType } from "../../types";
import useChain from "../../useChain";

export const SolanaWalletAdapterModalContext =
  React.createContext<ModalContextType>({} as ModalContextType);

// Create the context provider component
export default function SolanaWalletAdapterModalProvider({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  const { wallet, connect } = useWallet();
  const [canConnect, setcanConnect] = React.useState(false);
  const { setVisible } = useWalletModal();
  const { chain } = useChain();

  const openConnectModal = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  useEffect(() => {
    if (canConnect) {
      connect();
    }
  }, [canConnect]);

  useEffect(() => {
    if (!wallet?.adapter.publicKey) {
      if (chain?.type === ChainType.Solana) {
        setcanConnect(true);
        setVisible(true);
        return;
      }

      setVisible(false);
      setcanConnect(false);
    }
  }, [chain, setVisible, wallet?.adapter]);

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
