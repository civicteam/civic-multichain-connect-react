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
import { Adapter } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

const DEFAULT_RPC_ENDPOINT = clusterApiUrl("mainnet-beta");

export type SolanaChain = {
  number: string;
  name: string;
  rpcEndpoint: string;
} & Chain;

interface SolanaIntegrationProps {
  children: React.ReactNode;
  chains: SolanaChain[];
  wallets: Adapter[];
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
    if (selectedChain) {
      return;
    }

    const chain = chains.find((chain) => chain.type === ChainType.Solana);

    if (chain && connected) {
      setSelectedChain(chain);
    }
  }, [chains, connected, setSelectedChain, selectedChain]);

  // This component doesn't render anything, it just manages wallet connection state
  return null;
}

export function MultichainSolanaProvider({
  children,
  chains,
  wallets,
}: SolanaIntegrationProps) {
  const { selectedChain, registerChains } = useMultichainModal();

  useEffect(() => {
    registerChains(
      chains.map((chain) => ({
        ...chain,
        type: ChainType.Solana,
      }))
    );
  }, [registerChains, chains]);

  const endpoint = useMemo(() => {
    return (selectedChain as SolanaChain)?.rpcEndpoint ?? DEFAULT_RPC_ENDPOINT;
  }, [chains, selectedChain]);

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
