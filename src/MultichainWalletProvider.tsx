/* eslint-disable @typescript-eslint/no-unused-vars */
import { WalletStandardProvider } from "@wallet-standard/react-core";
import React, { ReactElement } from "react";
import { ChainProviderFn } from "wagmi";
import {
  isEvmChain,
  isSolanaChain,
  mapToEvmChain,
  mapToSolanaChain,
} from "./utils";
import MultichainWalletDisconnectProvider from "./MultichainWalletDisconnectProvider";
import ChainSelectorModalProvider from "./chainSelector/ChainSelectorProvider";
import { defaultLabels } from "./constants";
import LabelProvider from "./LabelProvider";
import {
  EVMChain,
  Labels,
  SolanaChain,
  SupportedChains,
} from "./types";
import SolanaWalletAdapterConfig from "./solana/solanaWalletAdapter/SolanaWalletAdapterConfig";
import RainbowkitConfig from "./ethereum/rainbowkit/RainbowkitConfig";

// Create the context provider component
export default function MultichainWalletProvider({
  children,
  chains,
  initialChain,
  labels,
  providers = [],
}: {
  children?: React.ReactNode;
  chains: SupportedChains[];
  initialChain?: SupportedChains;
  labels?: Labels;
  providers?: ChainProviderFn[];
}): ReactElement {
  const ethereumChains = chains?.filter(isEvmChain).map(mapToEvmChain) || [];
  const solanaChains = chains?.filter(isSolanaChain).map(mapToSolanaChain) || [];
  const mappedChains = solanaChains?.concat(ethereumChains);

  const initialEvmChain = isEvmChain(initialChain)
    ? mapToEvmChain(initialChain)
    : undefined;

  return (
    <LabelProvider labels={labels}>
      <WalletStandardProvider>
        <ChainSelectorModalProvider chains={mappedChains}>
          <RainbowkitConfig
            chains={ethereumChains as EVMChain[]}
            initialChain={initialEvmChain as EVMChain}
            providers={providers}
          >
            <SolanaWalletAdapterConfig chains={solanaChains as SolanaChain[]}>
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
  initialChain: undefined,
  providers: [],
};
