import React, { ReactElement, useContext, useEffect, useMemo } from "react";
import {
  RainbowKitProvider,
  Theme,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import {
  WagmiConfig,
  ChainProviderFn,
  configureChains,
  createConfig,
} from "wagmi";
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
    return configureChains([...chains, ...(testnetChains || [])], providers);
  }, [chains]);

  const wagmiConfig = useMemo(() => {
    const { appName, walletConnectProjectId } = options;
    const { connectors } = getDefaultWallets({
      appName,
      projectId: walletConnectProjectId,
      chains: configuredChains,
    });

    return createConfig({
      autoConnect: true,
      connectors,
      publicClient,
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
