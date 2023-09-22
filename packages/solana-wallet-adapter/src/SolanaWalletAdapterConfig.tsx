import React, { ReactElement, useContext, useEffect, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
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
import { Chain, DEFAULT_ENDPOINT } from "./types.js";
import { Adapter } from "@solana/wallet-adapter-base";

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
  adapters,
}: {
  children?: React.ReactNode;
  chains: Chain[];
  testnetChains?: Chain[];
  adapters: Adapter[];
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
      <WalletProvider wallets={adapters} autoConnect>
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
