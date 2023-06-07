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
} from "./SolanaWalletAdapterModalProvider";
import SolanaWalletAdapterProvider, {
  SolanaWalletAdapterContext,
} from "./SolanaWalletAdapterProvider";
import {
  BaseChain,
  SupportedChains,
  useChain,
  useWalletAdapters,
} from "@civic/multichain-connect-react-core";
import { SolanaWalletAdapterButton } from "./SolanaWalletAdapterButton";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Chain } from "./types";

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
    setWalletAdapter("solana", {
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
}: {
  children?: React.ReactNode;
  chains: Chain[];
}): JSX.Element | null {
  // For now support only a single chain
  const { setChains, chains: existingChains } = useChain<
    SupportedChains.Solana,
    Chain & BaseChain,
    never
  >();

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

  if (chains.length === 0) {
    return <>{children}</>;
  }

  const chain = chains[0];
  const { connection } = chain;
  const endpoint = connection.rpcEndpoint;

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
