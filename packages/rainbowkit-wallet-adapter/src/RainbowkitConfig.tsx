import React, { ReactElement, useContext, useEffect, useMemo } from "react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  Theme,
} from "@rainbow-me/rainbowkit";
import { phantomWallet } from "@rainbow-me/rainbowkit/wallets";
import { registerWallet } from "@wallet-standard/wallet";
import {
  createClient,
  WagmiConfig,
  configureChains,
  ChainProviderFn,
} from "wagmi";
import { EIP1193Wallet } from "./eip113Wallet";
import "@rainbow-me/rainbowkit/styles.css";
import ModalContextProvider, {
  RainbowkitModalContext,
} from "./RainbowkitModalProvider";
import WalletContextProvider, {
  RainbowkitWalletContext,
} from "./RainbowkitWalletProvider";
import {
  useLabel,
  LabelEntry,
  useWalletAdapters,
  SupportedChains,
  useChain,
  BaseChain,
} from "@civic/multichain-connect-react-core";
import { publicProvider } from "wagmi/providers/public";
import { RainbowkitButton } from "./RainbowkitButton";
import { Chain } from "./types";

function RainbowkitPluginProvider({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  const { setWalletAdapter } = useWalletAdapters();
  const wallet = useContext(RainbowkitWalletContext);
  const modal = useContext(RainbowkitModalContext);

  useEffect(() => {
    setWalletAdapter(SupportedChains.Ethereum, {
      context: { ...wallet, ...modal, chain: SupportedChains.Ethereum },
      button: <RainbowkitButton />,
    });
  }, [wallet, modal]);

  return <>{children}</>;
}

function RainbowkitConfig({
  children,
  theme,
  chains,
  providers,
  initialChain,
}: {
  children?: React.ReactNode;
  theme?: Theme | null;
  providers?: ChainProviderFn[];
  chains: Chain[];
  initialChain?: Chain;
}): JSX.Element | null {
  const { labels } = useLabel();
  const { setChains, selectedChain } = useChain<
    SupportedChains.Ethereum,
    never,
    Chain & BaseChain
  >();

  const client = useMemo(() => {
    const { wallets } = getDefaultWallets({
      appName: "rainbowkit",
      chains: chains,
    });

    const connectors = connectorsForWallets([
      ...wallets,
      {
        groupName: labels[LabelEntry.OTHER],
        wallets: [phantomWallet({ chains })],
      },
    ]);

    const { provider } = configureChains(
      chains,
      providers && providers?.length > 0 ? providers : [publicProvider()]
    );

    // eslint-disable-next-line consistent-return
    return createClient({
      autoConnect: true,
      connectors,
      provider,
    });
    // There is an issue when recreating the client on every render
    // Check this when updating to the latest version of Rainbowkit
  }, []);

  useEffect(() => {
    // Requiring at least one wallet to be registered in the Standard compatible way
    // Register the EIP1193 wallet here so the other wallets will be shown
    // This wallet is not included in the list of default wallets because it is just a way to get the other wallets to show up
    const wallet = new EIP1193Wallet(window.ethereum);
    registerWallet(wallet);
  }, []);

  useEffect(() => {
    const evmChains = chains.map((chain) => ({
      ...chain,
      type: SupportedChains.Ethereum,
    }));
    setChains(evmChains, SupportedChains.Ethereum);
  }, [chains]);

  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider
        chains={chains}
        // if initialChain is not provided, use the selectedChain from the ChainContext
        initialChain={initialChain ?? selectedChain}
        theme={theme}
      >
        <WalletContextProvider initialChain={initialChain}>
          <ModalContextProvider>
            <RainbowkitPluginProvider>{children}</RainbowkitPluginProvider>
          </ModalContextProvider>
        </WalletContextProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

RainbowkitConfig.defaultProps = {
  children: null,
  initialChain: undefined,
};

export default RainbowkitConfig;
