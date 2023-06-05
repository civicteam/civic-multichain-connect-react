import { Wallet } from "ethers";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Chain as RainbowkitChain } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { ChainType, EVMChain, WalletContextType } from "../../types";
import useChain from "../../useChain";
import { getChainType } from "../../utils";

export const RainbowkitWalletContext = React.createContext<WalletContextType>(
  {} as WalletContextType
);

// Create the context provider component
export default function RainbowkitWalletProvider({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { setSelectedChain, chain: selectedChain, initialChain } = useChain();
  const [wallet, setWallet] = useState<Wallet>();
  const onDisconnect = () => setSelectedChain(undefined);
  const { connector, isConnected, address } = useAccount({ onDisconnect });

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

  const setChain = useCallback(
    (supportedChain: RainbowkitChain) => {
      if (
        (supportedChain as RainbowkitChain) &&
        switchNetwork &&
        selectedChain?.name !== supportedChain.name
      ) {
        switchNetwork(supportedChain.id);
        setSelectedChain({
          ...supportedChain,
          type: ChainType.Ethereum,
        });
      }
    },
    [switchNetwork, selectedChain]
  );

  useEffect(() => {
    if (
      initialChain &&
      getChainType(initialChain) === ChainType.Ethereum &&
      switchNetwork
    ) {
      setChain(initialChain as EVMChain);
    }
  }, [initialChain]);

  useEffect(() => {
    if ((chain as RainbowkitChain) && switchNetwork) {
      setChain(chain as EVMChain);
    }
  }, [chain]);

  return (
    <RainbowkitWalletContext.Provider value={context}>
      {children}
    </RainbowkitWalletContext.Provider>
  );
}
