import React, { useEffect, useMemo } from "react";
import {
  useMultichainModal,
  ChainType,
  Chain,
  ConnectionState,
} from "@civic/multichain-modal";
import { useWallet, WalletProvider } from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  useWalletModal,
} from "@solana/wallet-adapter-react-ui";
import { ConnectionProvider } from "@solana/wallet-adapter-react";

export type SolanaChain = {
  id: string;
  name: string;
  rpcEndpoint: string;
} & Chain;

interface SolanaIntegrationProps {
  children: React.ReactNode;
  chains: SolanaChain[];
}

function WalletConnectionManager() {
  // Get necessary state and functions from hooks
  const { connected, connecting } = useWallet();
  const { setVisible } = useWalletModal();
  const {
    selectedChain,
    walletConnections,
    _forceUpdate,
    setSelectedChain,
    setWalletConnection,
    chains,
  } = useMultichainModal();
  const connectionState = walletConnections.solana;

  // Update wallet connection state based on Solana wallet status
  useEffect(() => {
    const connectionState = connecting
      ? ConnectionState.Connecting
      : connected
      ? ConnectionState.Connected
      : ConnectionState.Disconnected;

    setWalletConnection(ChainType.Solana, connectionState);
  }, [connected, connecting, setWalletConnection]);

  // Show wallet modal if Solana is selected but disconnected
  useEffect(() => {
    if (
      connectionState === ConnectionState.Disconnected &&
      selectedChain?.type === ChainType.Solana
    ) {
      setVisible(true);
    }
  }, [selectedChain, setVisible, connectionState, _forceUpdate]);

  // Set selected chain to Solana when connected
  useEffect(() => {
    const chain = chains.find((chain) => chain.type === ChainType.Solana);

    if (chain && connected) {
      setSelectedChain(chain);
    }
  }, [chains, connected, setSelectedChain]);

  // This component doesn't render anything, it just manages wallet connection state
  return null;
}

export function MultichainSolanaProvider({
  children,
  chains,
}: SolanaIntegrationProps) {
  const { selectedChain, registerChains } = useMultichainModal();

  useEffect(() => {
    registerChains(chains);
  }, [registerChains, chains]);

  const endpoint = useMemo(() => {
    if (chains.length === 0) {
      throw new Error("No chains provided");
    }
    return (selectedChain as SolanaChain)?.rpcEndpoint ?? chains[0].rpcEndpoint;
  }, [chains, selectedChain]);

  const wallets = useMemo(() => [], []); // Add your wallet adapters here if needed

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletConnectionManager />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
