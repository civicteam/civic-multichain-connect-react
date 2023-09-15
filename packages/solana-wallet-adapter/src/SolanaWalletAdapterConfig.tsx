import React, { ReactElement, useContext, useEffect, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  LedgerWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  WalletConnectWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import SolanaWalletAdapterModalProvider, {
  SolanaWalletAdapterModalContext,
} from "./SolanaWalletAdapterModalProvider.js";
import SolanaWalletAdapterProvider, {
  SolanaWalletAdapterContext,
} from "./SolanaWalletAdapterProvider.js";
import {
  BaseChain,
  SupportedChains,
  useChain,
  useWalletAdapters,
} from "@civic/multichain-connect-react-core";
import { SolanaWalletAdapterButton } from "./SolanaWalletAdapterButton.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import {
  Chain,
  DEFAULT_ENDPOINT,
  SolanaConfigOptions,
  WalletAdapterNetwork,
} from "./types.js";

function SolanaWalletAdapterPluginProvider<T>({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  const { setWalletAdapter } = useWalletAdapters<
    SupportedChains.Solana,
    T,
    never
  >();

  const wallet = useContext(SolanaWalletAdapterContext);
  const modal = useContext(SolanaWalletAdapterModalContext);

  useEffect(() => {
    setWalletAdapter(SupportedChains.Solana, {
      context: { ...wallet, ...modal, chain: SupportedChains.Solana },
      button: <SolanaWalletAdapterButton />,
    });
  }, [wallet, modal]);

  return <>{children}</>;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function SolanaWalletAdapterConfig({
  children,
  chains,
  testnetChains,
  options,
}: {
  children?: React.ReactNode;
  chains: Chain[];
  testnetChains?: Chain[];
  options: SolanaConfigOptions;
}): JSX.Element | null {
  // For now support only a single chain
  const { setChains, selectedChain } = useChain<
    SupportedChains.Solana,
    Chain & BaseChain,
    never
  >();

  const endpoint = useMemo(() => {
    if (chains.length === 0 || !selectedChain?.rpcEndpoint) {
      return DEFAULT_ENDPOINT;
    }
    return selectedChain?.rpcEndpoint;
  }, [chains, selectedChain]);

  const network = useMemo(() => {
    return endpoint.includes("mainnet")
      ? WalletAdapterNetwork.Mainnet
      : WalletAdapterNetwork.Devnet;
  }, [endpoint]);

  // We manually add wallets that do not support the wallet standard
  // Wallets like Phantom, Metamask and Backpack all get injected by conforming to the standard
  const wallets = useMemo(
    () => [
      new SolflareWalletAdapter(),
      new LedgerWalletAdapter(),
      new WalletConnectWalletAdapter({
        options: { projectId: options.walletConnectProjectId },
        network,
      }),
      new TorusWalletAdapter(),
    ],
    []
  );

  useEffect(() => {
    const solanaChains = chains.map((chain) => ({
      ...chain,
      type: SupportedChains.Solana,
    }));

    const solanaTestnetChains = testnetChains?.map((chain) => ({
      ...chain,
      type: SupportedChains.Solana,
      testnet: true,
    }));

    setChains(
      [...solanaChains, ...(solanaTestnetChains || [])],
      SupportedChains.Solana
    );
  }, [chains]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <SolanaWalletAdapterProvider>
            <SolanaWalletAdapterModalProvider>
              <SolanaWalletAdapterPluginProvider>
                {children}
              </SolanaWalletAdapterPluginProvider>
            </SolanaWalletAdapterModalProvider>
          </SolanaWalletAdapterProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

SolanaWalletAdapterConfig.defaultProps = {
  children: null,
};

export default SolanaWalletAdapterConfig;
