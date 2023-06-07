/* eslint-disable @typescript-eslint/no-unused-vars */
import { WalletStandardProvider } from "@wallet-standard/react-core";
import React, { ReactElement } from "react";
import ChainSelectorModalProvider from "./MultichainSelectorProvider";
import { defaultLabels } from "./constants";
import LabelProvider from "./MultichainLabelProvider";
import MultichainWalletAdapterPluginProvider from "./MultichainWalletAdapterPluginProvider";
import MultichainWalletDisconnectProvider from "./MultichainWalletDisconnectProvider";
import { Labels } from "./types";

export default function MultichainWalletProvider({
  children,
  labels,
}: {
  children?: React.ReactNode;
  labels?: Labels;
}): ReactElement {
  return (
    <LabelProvider labels={labels}>
      <WalletStandardProvider>
        <ChainSelectorModalProvider>
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
