import React, { ReactElement, useContext, useEffect, useMemo } from "react";
import {
  RainbowKitProvider,
  Theme,
  connectorsForWallets,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import { walletConnectWallet } from "@rainbow-me/rainbowkit/wallets";
import {
  WagmiConfig,
  ChainProviderFn,
  configureChains,
  createConfig,
} from "wagmi";
import { isMobile } from "react-device-detect";
import "@rainbow-me/rainbowkit/styles.css";
import ModalContextProvider, {
  RainbowkitModalContext,
} from "./RainbowkitModalProvider.js";
import WalletContextProvider, {
  RainbowkitWalletContext,
} from "./RainbowkitWalletProvider.js";
import {
  useWalletAdapters,
  SupportedChains,
  useChain,
  BaseChain,
} from "@civic/multichain-connect-react-core";
import { RainbowkitButton } from "./RainbowkitButton.js";
import { Chain, RainbowkitConfigOptions } from "./types.js";
import RainbowkitOptionsProvider from "./RainbowitOptionsProvider.js";
import { goerli } from "viem/chains";

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
  testnetChains,
  providers,
  initialChain,
  options,
}: {
  children?: React.ReactNode;
  theme?: Theme | null;
  initialChain?: Chain;
  chains: Chain[];
  testnetChains?: Chain[];
  providers: ChainProviderFn[];
  options: RainbowkitConfigOptions;
}): JSX.Element | null {
  const { setChains, selectedChain } = useChain<
    SupportedChains.Ethereum,
    never,
    Chain & BaseChain
  >();

  const { chains: configuredChains, publicClient } = useMemo(() => {
    const userDefinedChains = [...chains, ...(testnetChains || [])];
    const defaultChain = [goerli];
    // we need one chain to be configured for the public client
    const configuredChains =
      userDefinedChains.length > 0 ? userDefinedChains : defaultChain;
    return configureChains(configuredChains, providers);
  }, [chains, testnetChains, providers]);

  const wagmiConfig = useMemo(() => {
    const { appName, walletConnectProjectId } = options;

    let chosenConnectors;

    if (isMobile) {
      chosenConnectors = connectorsForWallets([
        {
          groupName: appName,
          wallets: [
            walletConnectWallet({
              projectId: walletConnectProjectId,
              chains: configuredChains,
            }),
          ],
        },
      ]);
    } else {
      chosenConnectors = getDefaultWallets({
        appName,
        projectId: walletConnectProjectId,
        chains: configuredChains,
      }).connectors;
    }

    return createConfig({
      autoConnect: true,
      connectors: chosenConnectors,
      publicClient,
    });
  }, [configuredChains, options, publicClient]);

  const [evmInitialChain, setEvmInitialChain] = React.useState<
    Chain | undefined
  >(undefined);

  useEffect(() => {
    const evmChains = chains.map((chain) => ({
      ...chain,
      type: SupportedChains.Ethereum,
    }));

    const evmTestnetChains = testnetChains?.map((chain) => ({
      ...chain,
      type: SupportedChains.Ethereum,
      testnet: true,
    }));

    const allChains = [...evmChains, ...(evmTestnetChains || [])];
    setChains(allChains, SupportedChains.Ethereum);

    const chain =
      initialChain && allChains.find((chain) => chain.id === initialChain?.id);
    setEvmInitialChain(chain);
  }, [chains, initialChain]);

  useEffect(() => console.log("wagmiConfig", wagmiConfig), [wagmiConfig]);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowkitOptionsProvider options={options}>
        <RainbowKitProvider
          chains={[...chains, ...(testnetChains || [])]}
          // if initialChain is not provided, use the selectedChain from the ChainContext
          initialChain={evmInitialChain ?? selectedChain}
          theme={theme}
        >
          <WalletContextProvider initialChain={evmInitialChain}>
            <ModalContextProvider>
              <RainbowkitPluginProvider>{children}</RainbowkitPluginProvider>
            </ModalContextProvider>
          </WalletContextProvider>
        </RainbowKitProvider>
      </RainbowkitOptionsProvider>
    </WagmiConfig>
  );
}

RainbowkitConfig.defaultProps = {
  children: null,
  initialChain: undefined,
};

export default RainbowkitConfig;
