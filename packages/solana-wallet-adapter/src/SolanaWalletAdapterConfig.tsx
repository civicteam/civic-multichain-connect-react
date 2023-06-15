import React, { ReactElement, useContext, useEffect, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  BackpackWalletAdapter,
  BraveWalletAdapter,
  ExodusWalletAdapter,
  GlowWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
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
import { Chain, DEFAULT_ENDPOINT } from "./types.js";

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
  initialChain,
}: {
  children?: React.ReactNode;
  chains: Chain[];
  initialChain?: Chain;
}): JSX.Element | null {
  // For now support only a single chain
  const { setChains } = useChain<
    SupportedChains.Solana,
    Chain & BaseChain,
    never
  >();

  const endpoint = useMemo(() => {
    if (chains.length === 0) {
      return DEFAULT_ENDPOINT;
    }

    const { rpcEndpoint } = chains[0];
    return rpcEndpoint;
  }, [chains]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new BraveWalletAdapter(),
      new SolflareWalletAdapter(),
      new LedgerWalletAdapter(),
      new BackpackWalletAdapter(),
      new GlowWalletAdapter(),
      new ExodusWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    []
  );

  useEffect(() => {
    const solanaChains = chains.map((chain) => ({
      ...chain,
      type: SupportedChains.Solana,
    }));
    setChains(solanaChains, SupportedChains.Solana);
  }, [chains]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <SolanaWalletAdapterProvider initialChain={initialChain}>
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
