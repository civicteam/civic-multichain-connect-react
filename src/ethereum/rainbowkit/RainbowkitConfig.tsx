// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useEffect, useMemo } from "react";
import { publicProvider } from "wagmi/providers/public";
import {
  RainbowKitProvider,
  getDefaultWallets,
  Chain as RainbowkitChain,
} from "@rainbow-me/rainbowkit";
import { registerWallet } from "@wallet-standard/wallet";
import { createClient, WagmiConfig, configureChains } from "wagmi";
import { EIP1193Wallet } from "../eip113Wallet";
import "@rainbow-me/rainbowkit/styles.css";
import ModalContextProvider from "./RainbowkitModalProvider";
import WalletContextProvider from "./RainbowkitWalletProvider";
import { APP_NAME } from "../../config";
import useChain from "../../useChain";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function RainbowkitConfig({
  children,
  chains,
}: {
  children?: React.ReactNode;
  chains: RainbowkitChain[];
}): JSX.Element | null {
  const { chain } = useChain();
  const client = useMemo(() => {
    if (chains && chains.length === 0) {
      return;
    }

    const { connectors } = getDefaultWallets({
      appName: APP_NAME,
      chains,
    });

    const { provider } = configureChains(chains, [publicProvider()]);

    // eslint-disable-next-line consistent-return
    return createClient({
      autoConnect: true,
      connectors,
      provider,
    });
    // There is an issue when recreating the client on every render
    // Check this when updating to the latest version of Rainbowkit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Requiring at least one wallet to be registered in the Standard compatible way
    // Register the EIP1193 wallet here so the other wallets will be shown
    // This wallet is not included in the list of default wallets because it is just a way to get the other wallets to show up
    const wallet = new EIP1193Wallet(window.ethereum);
    registerWallet(wallet);
  }, []);

  if (!client) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  const filteredChains = chains.filter((c) => c.name === chain?.name);

  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider chains={filteredChains}>
        <WalletContextProvider>
          <ModalContextProvider>{children}</ModalContextProvider>
        </WalletContextProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

RainbowkitConfig.defaultProps = {
  children: null,
};

export default RainbowkitConfig;
