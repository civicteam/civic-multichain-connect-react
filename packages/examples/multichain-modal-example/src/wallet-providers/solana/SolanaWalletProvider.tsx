import React, { useEffect, useMemo, createContext, useContext } from "react";
import {
  useMultichainModal,
  ChainType,
  Chain,
  ConnectionState,
} from "@civic/multichain-modal";
import {
  ConnectionProvider,
  useConnection,
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
  const { selectedChain, walletConnections, _forceUpdate } =
    useMultichainModal();
  const { connect, wallets, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { connection } = useConnection();
  const { chains, setSelectedChain } = useMultichainModal();
  const connectionState = walletConnections.solana;

  useEffect(() => {
    if (
      connectionState === ConnectionState.Disconnected &&
      selectedChain?.type === ChainType.Solana
    ) {
      setVisible(true);
    }
  }, [
    selectedChain,
    connect,
    connectionState,
    _forceUpdate,
    wallets,
    setVisible,
  ]);

  useEffect(() => {
    const chain = chains.find(
      (chain) => (chain as SolanaChain).rpcEndpoint === connection?.rpcEndpoint
    );

    if (chain && connected) {
      setSelectedChain(chain);
    }
  }, [connection.rpcEndpoint, chains, connected]);

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
  const { registerChains, setWalletConnection } = useMultichainModal();

  useEffect(() => {
    registerChains(chains);
  }, [registerChains, chains]);

  useEffect(() => {
    if (disconnecting) {
      return setWalletConnection(
        ChainType.Solana,
        ConnectionState.Disconnected
      );
    } else if (connecting) {
      return setWalletConnection(ChainType.Solana, ConnectionState.Connecting);
    } else if (connected) {
      return setWalletConnection(ChainType.Solana, ConnectionState.Connected);
    }

    return setWalletConnection(ChainType.Solana, ConnectionState.Disconnected);
  }, [connected, connecting, disconnecting, setWalletConnection]);

  return null;
}

export function SolanaWalletProvider({
  children,
  chains,
}: SolanaWalletProviderProps) {
  const { selectedChain } = useMultichainModal();
  const wallets = useMemo(
    () => [new PhantomWalletAdapter()], // Add other wallet adapters here
    []
  );

  const endpoint = useMemo(() => {
    if (chains.length === 0) {
      throw new Error("No chains provided");
    }
    const rpc =
      (selectedChain as SolanaChain)?.rpcEndpoint ?? chains[0].rpcEndpoint;
    return rpc;
  }, [chains, selectedChain]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletContextManager>
            <SolanaConnectionManager chains={chains} />
            <WalletConnectionManager />
            {children}
          </WalletContextManager>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
