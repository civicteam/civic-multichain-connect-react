import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, useConnectModal } from "@rainbow-me/rainbowkit";
import { Chain } from "wagmi/chains";
import { useAccount } from "wagmi";
import {
  ChainType,
  ConnectionState,
  useMultichainModal,
} from "@civic/multichain-modal";
import { createContext, useContext, useEffect } from "react";
import { WalletClient } from "viem";
import React from "react";

interface EthereumWalletContextType {
  isConnected: boolean;
  walletSigner: WalletClient | null;
  address: string | undefined;
}

const EthereumWalletContext = createContext<EthereumWalletContextType>({
  isConnected: false,
  walletSigner: null,
  address: undefined,
});

export const useEthereumWallet = () => useContext(EthereumWalletContext);

interface WalletProviderProps {
  children: React.ReactNode;
  chains: Chain[];
}

function ConnectionManager({ chains }: { chains: Chain[] }) {
  const {
    selectedChain,
    setSelectedChain,
    chains: modalChains,
    walletConnections,
    _forceUpdate,
    registerChains,
    setWalletConnection,
  } = useMultichainModal();

  const account = useAccount();
  const { openConnectModal } = useConnectModal();
  const { isConnected, isConnecting, isDisconnected } = useAccount();

  // Register chains
  useEffect(() => {
    registerChains(
      chains.map((chain) => ({
        ...chain,
        type: ChainType.Ethereum,
      }))
    );
  }, [registerChains, chains]);

  // Manage connection state
  useEffect(() => {
    if (isConnected) {
      setWalletConnection(ChainType.Ethereum, ConnectionState.Connected);
    } else if (isConnecting) {
      setWalletConnection(ChainType.Ethereum, ConnectionState.Connecting);
    } else if (isDisconnected) {
      setWalletConnection(ChainType.Ethereum, ConnectionState.Disconnected);
    }
  }, [isConnected, isConnecting, isDisconnected, setWalletConnection]);

  // Open connect modal when needed
  useEffect(() => {
    if (
      walletConnections.ethereum === ConnectionState.Disconnected &&
      selectedChain?.type === ChainType.Ethereum
    ) {
      openConnectModal?.();
    }
  }, [
    selectedChain,
    openConnectModal,
    walletConnections.ethereum,
    _forceUpdate,
  ]);

  // Set selected chain
  useEffect(() => {
    if (account.chain) {
      const chain =
        modalChains.find((chain) => chain.id === account.chain?.id) ?? null;
      setSelectedChain(chain);
    }
  }, [account.chain, setSelectedChain, modalChains]);

  return null;
}

type RainbowKitProviderProps = React.ComponentProps<typeof RainbowKitProvider>;

export function MultichainRainbowKitProvider({
  children,
  chains,
  ...rainbowKitProps
}: WalletProviderProps & RainbowKitProviderProps) {
  const { selectedChain } = useMultichainModal();
  const chain =
    chains.find((chain) => chain.id === selectedChain?.id) ?? undefined;

  return (
    <RainbowKitProvider initialChain={chain?.id} {...rainbowKitProps}>
      <ConnectionManager chains={chains} />
      {children}
    </RainbowKitProvider>
  );
}
