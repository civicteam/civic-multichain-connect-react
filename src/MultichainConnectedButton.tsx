import React from "react";
import { RainbowkitButton } from "./ethereum/rainbowkit/RainbowkitButton";
import { SolanaWalletAdapterButton } from "./solana/solanaWalletAdapter/SolanaWalletAdapterButton";
import useWallet from "./useWallet";
import { getWalletChainType } from "./utils";
import { ChainType } from "./types";

export function MultichainConnectedButton(): JSX.Element | null {
  const { wallet, chain: selectedChain } = useWallet();
  const isSolanaChain =
    getWalletChainType(wallet) === ChainType.Solana &&
    selectedChain?.type === ChainType.Solana;
  const isEthersChain =
    getWalletChainType(wallet) === ChainType.Ethereum &&
    selectedChain?.type === ChainType.Ethereum;

  return (
    <>
      {isSolanaChain && <SolanaWalletAdapterButton />}
      {isEthersChain && <RainbowkitButton />}
    </>
  );
}
