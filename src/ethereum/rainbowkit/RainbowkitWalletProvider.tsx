import { Wallet } from "ethers";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { WalletContextType } from "../../types";

export const RainbowkitWalletContext = React.createContext<WalletContextType>(
  {} as WalletContextType
);

// Create the context provider component
export default function RainbowkitWalletProvider({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  const { connector, isConnected } = useAccount();
  const [wallet, setWallet] = useState<Wallet>();

  useEffect(() => {
    connector?.getSigner().then((connectedWallet) => {
      setWallet(connectedWallet);
    });
  }, [connector]);

  useEffect(() => {
    if (!isConnected) {
      setWallet(undefined);
    }
  }, [isConnected]);

  const context = useMemo(
    () => ({
      wallet,
      connected: isConnected,
    }),
    [isConnected, wallet]
  );

  return (
    <RainbowkitWalletContext.Provider value={context}>
      {children}
    </RainbowkitWalletContext.Provider>
  );
}
