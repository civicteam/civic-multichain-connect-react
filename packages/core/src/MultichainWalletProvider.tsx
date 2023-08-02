/* eslint-disable @typescript-eslint/no-unused-vars */
import { WalletStandardProvider } from "@wallet-standard/react-core";
import React, { ReactElement } from "react";
import ChainSelectorModalProvider from "./MultichainSelectorProvider.js";
import { defaultLabels } from "./constants.js";
import LabelProvider from "./MultichainLabelProvider.js";
import MultichainWalletAdapterPluginProvider from "./MultichainWalletAdapterPluginProvider.js";
import MultichainWalletDisconnectProvider from "./MultichainWalletDisconnectProvider.js";
import { Labels } from "./types.js";

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
};
