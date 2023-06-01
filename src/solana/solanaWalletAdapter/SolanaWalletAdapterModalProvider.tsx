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
  const { setVisible } = useWalletModal();
  const { chain } = useChain();

  const openConnectModal = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  useEffect(() => {
    if (wallet) {
      connect();
    }
  }, [connect, wallet]);

  useEffect(() => {
    if (chain?.type === ChainType.Solana) {
      setVisible(true);
    }
  }, [chain, setVisible]);

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
