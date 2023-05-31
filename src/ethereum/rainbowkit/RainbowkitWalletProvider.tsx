import { Wallet } from "ethers";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { Chain as RainbowkitChain } from "@rainbow-me/rainbowkit";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { ChainType, EVMChain, WalletContextType } from "../../types";
import useChain from "../../useChain";

export const RainbowkitWalletContext = React.createContext<WalletContextType>(
  {} as WalletContextType
);

// Create the context provider component
export default function RainbowkitWalletProvider({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  const { connector, isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { setSelectedChain } = useChain();
  const [wallet, setWallet] = useState<Wallet>();

  useEffect(() => {
    connector?.getSigner().then((connectedWallet) => {
      setWallet(connectedWallet);
    });
  }, [connector, address]);

  useEffect(() => {
    if (!isConnected) {
      setWallet(undefined);
    }
  }, [isConnected, address]);

  const context = useMemo(
    () => ({
      wallet,
      connected: isConnected,
    }),
    [isConnected, wallet]
  );

  useEffect(() => {
    const supportedChain = chain as EVMChain;
    if ((chain as RainbowkitChain) && switchNetwork) {
      switchNetwork(supportedChain.id);
      setSelectedChain({
        ...supportedChain,
        type: ChainType.Ethereum,
      });
    }
  }, [chain, setSelectedChain, switchNetwork]);

  return (
    <RainbowkitWalletContext.Provider value={context}>
      {children}
    </RainbowkitWalletContext.Provider>
  );
}
