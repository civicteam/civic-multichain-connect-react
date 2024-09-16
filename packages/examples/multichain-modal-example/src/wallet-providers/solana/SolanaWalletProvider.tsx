import React, { useEffect } from "react";
import { useMultichainModal, ChainType, Chain } from "@civic/multichain-modal";

export type SolanaChain = {
  id: string;
  name: string;
  rpcEndpoint: string;
} & Chain;

interface SolanaWalletProviderProps {
  children: React.ReactNode;
  chains: SolanaChain[];
}

export function SolanaWalletProvider({
  children,
  chains,
}: SolanaWalletProviderProps) {
  const { registerChains, selectedChain } = useMultichainModal();

  useEffect(() => {
    registerChains(
      chains.map((chain) => ({
        id: chain.id,
        name: chain.name,
        type: ChainType.Solana,
        testnet: chain.id.includes("devnet"),
        iconUrl: "/solana.svg", // You might want to customize this
      }))
    );
  }, [registerChains, chains.length]);

  // Implement Solana wallet connection logic here
  // Use the `selectedChain` to determine whether to connect or not
  // ...

  return <>{children}</>;
}
