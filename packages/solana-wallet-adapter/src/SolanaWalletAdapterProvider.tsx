import React, { ReactElement, useEffect, useMemo } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Chain,
  SolanaChain,
  WalletContextType,
  useChain,
} from "@civic/multichain-connect-react-core";
import { SupportedWallets } from "@civic/multichain-connect-react-core";

export const SolanaWalletAdapterContext =
  React.createContext<WalletContextType>({} as WalletContextType);

// Create the context provider component
export default function SolanaWalletAdapterProvider({
  children,
  chains,
}: {
  children: React.ReactNode;
  chains: SolanaChain[];
}): ReactElement {
  const { wallet, connected, disconnect, disconnecting } = useWallet();
  const adapter = useWallet();
  const { setSelectedChain, chain: selectedChain } = useChain();
  const { connection } = useConnection();

  const context = useMemo(
    () => ({
      // Figure out how to get the wallet from the adapter
      wallet: adapter.wallet ? (adapter as SupportedWallets) : undefined,
      connected,
      disconnect,
    }),
    [adapter, connected]
  );

  useEffect(() => {
    if (wallet?.adapter.publicKey) {
      const chain = chains.filter(
        (c) => c.connection.rpcEndpoint === connection.rpcEndpoint
      );

      console.log("chain", chain, selectedChain);
      if (selectedChain?.name !== chain[0]?.name) {
        setSelectedChain(chain[0] as Chain);
      }
    }
  }, [
    chains,
    connection,
    setSelectedChain,
    wallet?.adapter.publicKey?.toBase58(),
  ]);

  useEffect(() => {
    if (disconnecting) {
      setSelectedChain(undefined);
    }
  }, [disconnecting]);

  return (
    <SolanaWalletAdapterContext.Provider value={context}>
      {children}
    </SolanaWalletAdapterContext.Provider>
  );
}
