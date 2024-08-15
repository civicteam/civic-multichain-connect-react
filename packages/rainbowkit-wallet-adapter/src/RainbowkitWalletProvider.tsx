/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import {
  useAccount,
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
  const { connector, isConnected, address } = useAccount();

  useEffect(() => {
    const result = useWalletClient();
    setWallet(result.data);
  }, [connector, address, chainId]);

  useEffect(() => {
    if (!isConnected) {
      setWallet(undefined);
    }
  }, [isConnected, address, chainId]);

  const context = useMemo(
    () => ({
      wallet,
      connected: isConnected,
      disconnect,
    }),
    [isConnected, wallet]
  );

  useEffect(() => {
    const chain = chains.find((c) => c.id === chainId);
    if (!chain) return;

    switchChain({ chainId });
    setSelectedChain({
      ...chain,
      type: SupportedChains.Ethereum,
    });
  }, [chainId, setSelectedChain, switchChain]);

  // Allow the chains to be switched at runtime
  useEffect(() => {
    if (isConnected && initialChain) {
      switchChain({ chainId: initialChain.id });
      setSelectedChain({
        ...initialChain,
        type: SupportedChains.Ethereum,
      });
    }
  }, [isConnected, initialChain, setSelectedChain]);

  return (
    <RainbowkitWalletContext.Provider value={context}>
      {children}
    </RainbowkitWalletContext.Provider>
  );
}
