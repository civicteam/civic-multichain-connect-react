/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import { RainbowkitButton } from "./ethereum/rainbowkit/RainbowkitButton";
import { SolanaWalletAdapterButton } from "./solana/solanaWalletAdapter/SolanaWalletAdapterButton";
import useWallet from "./useWallet";
import { getWalletChainType } from "./utils";
import { ChainType } from "./types";

export function MultichainConnectedButton(): JSX.Element | null {
  const { wallet } = useWallet();
  const isSolanaChain = getWalletChainType(wallet) === ChainType.Solana;
  const isEthersChain = getWalletChainType(wallet) === ChainType.Ethereum;

  return (
    <>
      {isSolanaChain && <SolanaWalletAdapterButton />}
      {isEthersChain && <RainbowkitButton />}
    </>
  );
}
