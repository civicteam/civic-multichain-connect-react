import React, { ReactElement, useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletContextType } from "../../types";

export const SolanaWalletAdapterContext =
  React.createContext<WalletContextType>({} as WalletContextType);

// Create the context provider component
export default function SolanaWalletAdapterProvider({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  const { wallet, connected } = useWallet();

  const context = useMemo(
    () => ({
      // Figure out how to get the wallet from the adapter
      wallet: wallet || undefined,
      connected,
    }),
    [connected, wallet]
  );

  return (
    <SolanaWalletAdapterContext.Provider value={context}>
      {children}
    </SolanaWalletAdapterContext.Provider>
  );
}
