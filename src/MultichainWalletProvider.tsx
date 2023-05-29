/* eslint-disable @typescript-eslint/no-unused-vars */
import { WalletStandardProvider } from "@wallet-standard/react-core";
import React, { ReactElement } from "react";
import MultichainWalletDisconnectProvider from "./MultichainWalletDisconnectProvider";
import ChainSelectorModalProvider from "./chainSelector/ChainSelectorProvider";
import { defaultLabels } from "./constants";
import LabelProvider from "./LabelProvider";
import { Chain, ChainType, EVMChain, Labels, SolanaChain } from "./types";
import SolanaWalletAdapterConfig from "./solana/solanaWalletAdapter/SolanaWalletAdapterConfig";
import RainbowkitConfig from "./ethereum/rainbowkit/RainbowkitConfig";

// Create the context provider component
export default function MultichainWalletProvider({
  children,
  chains,
  labels,
}: {
  children?: React.ReactNode;
  chains: Chain[];
  labels?: Labels;
}): ReactElement {
  const ethereumChains = chains?.filter(
    (chain) => chain.type === ChainType.Ethereum
  ) as EVMChain[];

  const solanaChains = chains?.filter(
    (chain) => chain.type === ChainType.Solana
  ) as SolanaChain[];

  return (
    <LabelProvider labels={labels}>
      <WalletStandardProvider>
        <ChainSelectorModalProvider chains={chains}>
          <RainbowkitConfig chains={ethereumChains}>
            <SolanaWalletAdapterConfig chains={solanaChains}>
              <MultichainWalletDisconnectProvider>
                {children}
              </MultichainWalletDisconnectProvider>
            </SolanaWalletAdapterConfig>
          </RainbowkitConfig>
        </ChainSelectorModalProvider>
      </WalletStandardProvider>
    </LabelProvider>
  );
}

MultichainWalletProvider.defaultProps = {
  children: null,
  labels: defaultLabels,
};
