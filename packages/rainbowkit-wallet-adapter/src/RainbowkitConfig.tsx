import React, { ReactElement, useContext, useEffect, useMemo } from "react";
import {
  RainbowKitProvider,
  Theme,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
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
import { RainbowkitConfigOptions } from "./types.js";
import RainbowkitOptionsProvider from "./RainbowitOptionsProvider.js";
import { Chain, mainnet } from "wagmi/chains";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
  initialChain,
  options,
}: {
  children?: React.ReactNode;
  theme?: Theme | null;
  initialChain?: Chain;
  chains: Chain[];
  testnetChains?: Chain[];
  options: RainbowkitConfigOptions;
}): JSX.Element | null {
  const { setChains, selectedChain } = useChain<
    SupportedChains.Ethereum,
    never,
    Chain & BaseChain
  >();

  const queryClient = useMemo(() => new QueryClient(), []);

  const wagmiConfig = useMemo(() => {
    const { appName, walletConnectProjectId } = options;

    if (chains.length === 0) {
      return getDefaultConfig({
        appName,
        projectId: walletConnectProjectId,
        chains: [mainnet],
      });
    }

    // Interesting way to solve the typescript error
    const [firstChain, ...restChains] = chains;

    return getDefaultConfig({
      appName,
      projectId: walletConnectProjectId,
      chains: [firstChain, ...restChains],
    });
  }, []);

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

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowkitOptionsProvider options={options}>
          <RainbowKitProvider
            // if initialChain is not provided, use the selectedChain from the ChainContext
            initialChain={evmInitialChain ?? selectedChain}
            theme={theme}
            modalSize={options.modalSize}
          >
            <WalletContextProvider initialChain={evmInitialChain}>
              <ModalContextProvider>
                <RainbowkitPluginProvider>{children}</RainbowkitPluginProvider>
              </ModalContextProvider>
            </WalletContextProvider>
          </RainbowKitProvider>
        </RainbowkitOptionsProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

RainbowkitConfig.defaultProps = {
  children: null,
  initialChain: undefined,
};

export default RainbowkitConfig;
