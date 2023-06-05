/* eslint-disable @typescript-eslint/no-unused-vars */
import { WalletStandardProvider } from "@wallet-standard/react-core";
import React, { ReactElement } from "react";
import ChainSelectorModalProvider from "./chainSelector/ChainSelectorProvider";
import { defaultLabels } from "./constants";
import LabelProvider from "./MultichainLabelProvider";
import { Labels, SupportedChains } from "./types";
import MultichainWalletAdapterPluginProvider from "./MultichainWalletAdapterPluginProvider";
import MultichainWalletDisconnectProvider from "./MultichainWalletDisconnectProvider";

export default function MultichainWalletProvider({
  children,
  chains,
  initialChain,
  labels,
}: {
  children?: React.ReactNode;
  chains: SupportedChains[];
  initialChain?: SupportedChains;
  labels?: Labels;
}): ReactElement {
  return (
    <LabelProvider labels={labels}>
      <WalletStandardProvider>
        <ChainSelectorModalProvider initialChain={initialChain} chains={chains}>
          <MultichainWalletAdapterPluginProvider>
            <MultichainWalletDisconnectProvider>
              {children}
            </MultichainWalletDisconnectProvider>
          </MultichainWalletAdapterPluginProvider>
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
