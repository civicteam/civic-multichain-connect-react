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
import { goerli } from "wagmi/chains";
import { EIP1193Wallet } from "./eip113Wallet.js";
import "@rainbow-me/rainbowkit/styles.css";
import ModalContextProvider, {
  RainbowkitModalContext,
} from "./RainbowkitModalProvider.js";
import WalletContextProvider, {
  RainbowkitWalletContext,
} from "./RainbowkitWalletProvider.js";
import {
  useLabel,
  LabelEntry,
  useWalletAdapters,
  SupportedChains,
  useChain,
  BaseChain,
} from "@civic/multichain-connect-react-core";
import { publicProvider } from "wagmi/providers/public";
import { RainbowkitButton } from "./RainbowkitButton.js";
import { Chain, RainbowkitConfigOptions } from "./types.js";

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
  options,
}: {
  children?: React.ReactNode;
  theme?: Theme | null;
  providers?: ChainProviderFn[];
  chains: Chain[];
  testnetChains?: Chain[];
  options: RainbowkitConfigOptions;
}): JSX.Element | null {
  const { labels } = useLabel();
  const { setChains, selectedChain, initialChain } = useChain<
    SupportedChains.Ethereum,
    never,
    Chain & BaseChain
  >();
  const [evmInitialChain, setEvmInitialChain] = React.useState<
    Chain | undefined
  >(undefined);

  const client = useMemo(() => {
    const combinedChains = [...chains, ...(testnetChains || [])];

    const { wallets } = getDefaultWallets({
      appName: "rainbowkit",
      chains: combinedChains,
      projectId: options.walletConnectProjectId,
    });

    const connectors = connectorsForWallets([
      ...wallets,
      {
        groupName: labels[LabelEntry.OTHER],
        wallets: [phantomWallet({ chains: combinedChains })],
      },
    ]);

    // If no EVM chains are provided we won't show any, but wagmi still needs at least one for its config
    // So we add goerli as a default to appease wagmi
    const updatedChains =
      !combinedChains || combinedChains?.length === 0
        ? [goerli]
        : combinedChains;

    const { provider } = configureChains(
      updatedChains,
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
  }, [chains, testnetChains]);

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
    <WagmiConfig client={client}>
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
    </WagmiConfig>
  );
}

RainbowkitConfig.defaultProps = {
  children: null,
  initialChain: undefined,
};

export default RainbowkitConfig;
