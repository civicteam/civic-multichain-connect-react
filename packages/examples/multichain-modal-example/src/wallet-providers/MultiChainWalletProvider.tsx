/* eslint-disable require-extensions/require-extensions */
import React from "react";
import { WalletProvider as RainbowKitProvider } from "./ethereum/RainbowKitProvider";
// import { SolanaWalletProvider } from "./solana/SolanaWalletProvider.js";
import { Chain } from "wagmi/chains";

interface MultiChainWalletProviderProps {
  children: React.ReactNode;
  ethereumChains: Chain[];
  solanaEndpoint: string;
}

export function MultiChainWalletProvider({
  children,
  ethereumChains,
  solanaEndpoint,
}: MultiChainWalletProviderProps) {
  return (
    <RainbowKitProvider chains={ethereumChains}>
      {/* <SolanaWalletProvider endpoint={solanaEndpoint}> */}
      {children}
      {/* </SolanaWalletProvider> */}
    </RainbowKitProvider>
  );
}
