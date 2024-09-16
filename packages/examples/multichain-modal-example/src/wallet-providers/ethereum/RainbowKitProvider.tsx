import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider as RainbowKitProviderOriginal,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import { Chain } from "wagmi/chains";
import { useAccount, useWalletClient } from "wagmi";
import { ChainType, useMultichainModal } from "@civic/multichain-modal";
import { createContext, useContext, useEffect, useMemo } from "react";
import { WalletClient } from "viem";

interface EthereumWalletContextType {
  isConnected: boolean;
  walletSigner: WalletClient | null; // Replace 'any' with a more specific type if available
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

function WalletConnectionManager() {
  const { selectedChain, connectionState, _forceUpdate } = useMultichainModal();
  const { openConnectModal } = useConnectModal();

  useEffect(() => {
    if (
      connectionState === "disconnected" &&
      selectedChain?.type === ChainType.Ethereum
    ) {
      openConnectModal?.();
    }
  }, [selectedChain, openConnectModal, connectionState, _forceUpdate]);

  return null;
}

function WalletContextManager({ children }: { children: React.ReactNode }) {
  const { isConnected, address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const contextValue: EthereumWalletContextType = useMemo(
    () => ({
      isConnected,
      walletSigner: walletClient as WalletClient,
      address,
    }),
    [isConnected, walletClient, address]
  );

  return (
    <EthereumWalletContext.Provider value={contextValue}>
      {children}
    </EthereumWalletContext.Provider>
  );
}

export function EthereumConnectionManager({ chains }: { chains: Chain[] }) {
  const { isConnected, isConnecting, isDisconnected, status } = useAccount();
  const { registerChains, setConnectionState } = useMultichainModal();

  useEffect(() => {
    registerChains(
      chains.map((chain) => ({
        id: chain.id,
        name: chain.name,
        type: ChainType.Ethereum,
        testnet: chain.testnet ?? false,
        iconUrl: "/ethereum.svg",
      }))
    );
  }, [registerChains, chains]);

  useEffect(() => {
    if (isConnected) {
      setConnectionState("connected");
    }
  }, [isConnected, setConnectionState]);

  useEffect(() => {
    if (isConnecting) {
      setConnectionState("connecting");
    }
  }, [isConnected, isConnecting, setConnectionState]);

  useEffect(() => {
    if (isDisconnected) {
      setConnectionState("disconnected");
    }
  }, [setConnectionState, status]);

  return null;
}

export function RainbowKitProvider({ children, chains }: WalletProviderProps) {
  const { selectedChain } = useMultichainModal();
  const chain = chains.find((chain) => chain.id === selectedChain?.id);

  return (
    <RainbowKitProviderOriginal initialChain={chain}>
      <WalletContextManager>
        <EthereumConnectionManager chains={chains} />
        <WalletConnectionManager />
        {children}
      </WalletContextManager>
    </RainbowKitProviderOriginal>
  );
}
