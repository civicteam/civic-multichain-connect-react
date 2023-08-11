/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactElement, useContext, useEffect, useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import {
  BaseChain,
  SupportedChains,
  WalletContextType,
  useChain,
} from "@civic/multichain-connect-react-core";
import { Chain } from "./types.js";
import { Connection } from "@solana/web3.js";

export const SolanaProviderContext = {} as WalletContextType<
  any,
  any,
  never
> & { connection: Connection | undefined };

export const SolanaWalletAdapterContext = React.createContext<
  WalletContextType<any, any, never> & { connection: Connection | undefined }
>(SolanaProviderContext);

// Create the context provider component
export default function SolanaWalletAdapterProvider({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  const adapter = useWallet();
  const { wallet, connected, disconnect, publicKey } = adapter;
  const { setSelectedChain, selectedChain, chains } = useChain<
    SupportedChains.Solana,
    Chain & BaseChain,
    never
  >();

  const connection = useMemo(() => {
    return selectedChain?.rpcEndpoint
      ? new Connection(
          selectedChain?.rpcEndpoint,
          selectedChain?.commitmentOrConfig
        )
      : undefined;
  }, [selectedChain?.rpcEndpoint, selectedChain?.commitmentOrConfig]);

  const context = useMemo(
    () => ({
      // Figure out how to get the wallet from the adapter
      wallet: adapter,
      connected,
      disconnect,
      connection,
    }),
    [
      wallet?.adapter.publicKey,
      connected,
      connection?.rpcEndpoint,
      publicKey?.toBase58(),
    ]
  );

  useEffect(() => {
    if (wallet?.adapter.publicKey) {
      const chain = chains
        .filter((c) => c.type === SupportedChains.Solana)
        .filter((c) => c.rpcEndpoint === connection?.rpcEndpoint);

      if (selectedChain?.name !== chain[0]?.name) {
        setSelectedChain(chain[0]);
        return;
      }
    }
  }, [
    chains,
    connection?.rpcEndpoint,
    setSelectedChain,
    wallet?.adapter.publicKey?.toBase58(),
    connected,
    publicKey?.toBase58(),
  ]);

  return (
    <SolanaWalletAdapterContext.Provider value={context}>
      {children}
    </SolanaWalletAdapterContext.Provider>
  );
}

export const useSolanaWalletAdapterProvider = () =>
  useContext(SolanaWalletAdapterContext);
