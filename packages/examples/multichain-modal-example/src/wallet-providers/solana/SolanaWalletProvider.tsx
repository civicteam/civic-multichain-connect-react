import React, { useEffect, useMemo, createContext, useContext } from "react";
import { useMultichainModal, ChainType, Chain } from "@civic/multichain-modal";
import {
  useWallet,
  WalletContextState,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  useWalletModal,
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";

// Import other Solana wallet adapters as needed
import "@solana/wallet-adapter-react-ui/styles.css";

export type SolanaChain = {
  id: string;
  name: string;
  rpcEndpoint: string;
} & Chain;

interface SolanaWalletContextType {
  isConnected: boolean;
  walletSigner: WalletContextState | null; // Replace 'any' with a more specific type if available
  address: string | undefined;
}

const SolanaWalletContext = createContext<SolanaWalletContextType>({
  isConnected: false,
  walletSigner: null,
  address: undefined,
});

export const useSolanaWallet = () => useContext(SolanaWalletContext);

interface SolanaWalletProviderProps {
  children: React.ReactNode;
  chains: SolanaChain[];
}

function WalletConnectionManager() {
  const { selectedChain, connectionState, _forceUpdate } = useMultichainModal();
  const { connect, wallets } = useWallet();
  const { setVisible } = useWalletModal();

  useEffect(() => {
    if (
      connectionState === "disconnected" &&
      selectedChain?.type === ChainType.Solana
    ) {
      // Connect to the first available wallet
      setVisible(true);
    }
  }, [selectedChain, connect, connectionState, _forceUpdate, wallets]);

  return null;
}

function WalletContextManager({ children }: { children: React.ReactNode }) {
  const wallet = useWallet();
  const { connected, publicKey, signTransaction, signAllTransactions } = wallet;

  const contextValue: SolanaWalletContextType = useMemo(
    () => ({
      isConnected: connected,
      walletSigner: wallet,
      address: publicKey?.toBase58(),
    }),
    [connected, publicKey, signTransaction, signAllTransactions]
  );

  return (
    <SolanaWalletContext.Provider value={contextValue}>
      {children}
    </SolanaWalletContext.Provider>
  );
}

function SolanaConnectionManager({ chains }: { chains: SolanaChain[] }) {
  const { connected, connecting, disconnecting } = useWallet();
  const { registerChains, setConnectionState } = useMultichainModal();

  useEffect(() => {
    registerChains(chains);
  }, [registerChains, chains]);

  useEffect(() => {
    if (disconnecting) {
      setConnectionState("disconnected");
    } else if (connecting) {
      setConnectionState("connecting");
    } else if (connected) {
      setConnectionState("connected");
    }
  }, [connected, connecting, disconnecting, setConnectionState]);

  return null;
}

export function SolanaWalletProvider({
  children,
  chains,
}: SolanaWalletProviderProps) {
  const wallets = useMemo(
    () => [new PhantomWalletAdapter()], // Add other wallet adapters here
    []
  );

  return (
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <WalletContextManager>
          <SolanaConnectionManager chains={chains} />
          <WalletConnectionManager />
          {children}
        </WalletContextManager>
      </WalletModalProvider>
    </WalletProvider>
  );
}
