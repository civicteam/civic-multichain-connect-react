/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactElement, useEffect, useMemo } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  BaseChain,
  SupportedChains,
  WalletContextType,
  useChain,
} from "@civic/multichain-connect-react-core";
import { Chain } from "./types";

export const SolanaWalletAdapterContext = React.createContext<
  WalletContextType<any, any, never>
>({} as WalletContextType<any, any, never>);

// Create the context provider component
export default function SolanaWalletAdapterProvider({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  const { wallet, connected, disconnect } = useWallet();
  const { setSelectedChain, selectedChain, chains } = useChain<
    SupportedChains.Solana,
    Chain & BaseChain,
    never
  >();

  const { connection } = useConnection();
  const context = useMemo(
    () => ({
      // Figure out how to get the wallet from the adapter
      wallet: wallet?.adapter,
      connected,
      disconnect,
    }),
    [wallet?.adapter, connected]
  );

  useEffect(() => {
    if (wallet?.adapter.publicKey) {
      const chain = chains
        .filter((c) => c.type === SupportedChains.Solana)
        .filter((c) => c.connection.rpcEndpoint === connection.rpcEndpoint);

      if (selectedChain?.name !== chain[0]?.name) {
        setSelectedChain(chain[0]);
      }
    }
  }, [
    chains,
    connection,
    setSelectedChain,
    wallet?.adapter.publicKey?.toBase58(),
  ]);

  return (
    <SolanaWalletAdapterContext.Provider value={context}>
      {children}
    </SolanaWalletAdapterContext.Provider>
  );
}
