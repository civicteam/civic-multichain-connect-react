/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import {
  useDisconnect,
  useChainId,
  useWalletClient,
  useSwitchChain,
} from "wagmi";
import {
  SupportedChains,
  WalletContextType,
  useChain,
} from "@civic/multichain-connect-react-core";
import { Chain, Client } from "viem";

export const RainbowkitWalletContext = React.createContext<
  WalletContextType<any, any, any>
>({} as WalletContextType<any, any, any>);

// Create the context provider component
export default function RainbowkitWalletProvider({
  children,
  initialChain,
}: {
  children: React.ReactNode;
  initialChain?: Chain;
}): ReactElement {
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { chains, switchChain } = useSwitchChain();
  const { setSelectedChain } = useChain();
  const [wallet, setWallet] = useState<Client>();
  const result = useWalletClient();

  useEffect(() => {
    if (result.data) {
      setWallet(result.data);
    }
  }, [result.data, chainId]);

  useEffect(() => {
    if (!result.data) {
      setWallet(undefined);
    }
  }, [result.data, chainId]);

  const context = useMemo(
    () => ({
      wallet,
      connected: result.data ? true : false,
      disconnect,
    }),
    [result.data, wallet]
  );

  // This effect handles chain selection and switching based on the current chainId.
  // It ensures the selected chain matches the current chainId and updates the app state accordingly.
  useEffect(() => {
    // Early return if result data is not available
    if (!result.data) return;

    // The wallet changes before the chainId, so we need to check if the chainId matches the wallet chainId
    if (result.data.chain.id !== chainId) return;

    const chain = chains.find((c) => c.id === chainId);

    if (!chain) return;

    switchChain({ chainId });

    setSelectedChain({
      ...chain,
      type: SupportedChains.Ethereum,
    });
  }, [chainId, setSelectedChain, switchChain, result.data, chains]);

  // Allow the chains to be switched at runtime
  useEffect(() => {
    if (result.data && initialChain) {
      switchChain({ chainId: initialChain.id });
      setSelectedChain({
        ...initialChain,
        type: SupportedChains.Ethereum,
      });
    }
  }, [result.data, initialChain, setSelectedChain]);

  // Reset the selected chain if the wallet is disconnected
  useEffect(() => {
    if (!result.data) {
      setSelectedChain(undefined);
    }
  }, [result.data]);

  return (
    <RainbowkitWalletContext.Provider value={context}>
      {children}
    </RainbowkitWalletContext.Provider>
  );
}
