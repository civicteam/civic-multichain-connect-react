/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactElement, useEffect, useMemo } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  BaseChain,
  SupportedChains,
  WalletContextType,
  useChain,
  useLocalStorage,
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

const LOCAL_STORAGE_KEY = "multichain-solana-wallet-adapter";

// Create the context provider component
export default function SolanaWalletAdapterProvider({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  const adapter = useWallet();
  const {
    wallet,
    connected,
    disconnect,
    publicKey,
    disconnecting,
    connecting,
  } = adapter;
  const { get, set, clear } = useLocalStorage<Chain & BaseChain>();
  const { setSelectedChain, selectedChain } = useChain<
    SupportedChains.Solana,
    Chain & BaseChain,
    never
  >();

  const { connection } = useConnection();

  const context = useMemo(
    () => ({
      // Figure out how to get the wallet from the adapter
      wallet: adapter,
      connected,
      connecting,
      disconnect,
      connection,
    }),
    [
      wallet?.adapter.publicKey,
      connected,
      connecting,
      connection?.rpcEndpoint,
      publicKey?.toBase58(),
    ]
  );

  useEffect(() => {
    const storedChain = get(LOCAL_STORAGE_KEY);
    if (connected && storedChain) {
      setSelectedChain(storedChain);
    }
  }, [connected]);

  useEffect(() => {
    const storedChain = get(LOCAL_STORAGE_KEY);
    if (
      selectedChain &&
      selectedChain.type === SupportedChains.Solana &&
      !storedChain
    ) {
      set(LOCAL_STORAGE_KEY, selectedChain);
    }
  }, [selectedChain]);

  useEffect(() => {
    if (disconnecting) {
      clear(LOCAL_STORAGE_KEY);
      setSelectedChain(undefined);
    }
  }, [disconnecting]);

  return (
    <SolanaWalletAdapterContext.Provider value={context}>
      {children}
    </SolanaWalletAdapterContext.Provider>
  );
}
