/* eslint-disable @typescript-eslint/no-explicit-any */
import { Wallet } from "ethers";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import {
  SupportedChains,
  WalletContextType,
  useChain,
} from "@civic/multichain-connect-react-core";
import { Chain } from "./types";

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
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { setSelectedChain } = useChain();
  const [wallet, setWallet] = useState<Wallet>();
  const { connector, isConnected, address } = useAccount();

  useEffect(() => {
    connector?.getSigner().then((connectedWallet) => {
      setWallet(connectedWallet);
    });
  }, [connector, address, chain]);

  useEffect(() => {
    if (!isConnected) {
      setWallet(undefined);
    }
  }, [isConnected, address, chain]);

  const context = useMemo(
    () => ({
      wallet,
      connected: isConnected,
      disconnect,
    }),
    [isConnected, wallet]
  );

  useEffect(() => {
    if (chain && switchNetwork) {
      switchNetwork(chain.id);
      setSelectedChain({
        ...chain,
        type: SupportedChains.Ethereum,
      });
    }
  }, [chain, setSelectedChain, switchNetwork]);

  // Allow the chains to be switched at runtime
  useEffect(() => {
    if (isConnected && initialChain && switchNetwork) {
      switchNetwork(initialChain.id);
      setSelectedChain({
        ...initialChain,
        type: SupportedChains.Ethereum,
      });
    }
  }, [isConnected, initialChain, setSelectedChain, switchNetwork]);

  return (
    <RainbowkitWalletContext.Provider value={context}>
      {children}
    </RainbowkitWalletContext.Provider>
  );
}
