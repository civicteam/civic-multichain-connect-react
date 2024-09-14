import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultConfig,
  RainbowKitProvider,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import { useAccount, useWalletClient, WagmiProvider } from "wagmi";
import { Chain } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
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
  const { selectedChain } = useMultichainModal();
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (selectedChain?.type === ChainType.Ethereum) {
      openConnectModal?.();
    }
  }, [selectedChain, isConnected, openConnectModal]);

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

export function WalletProvider({ children, chains }: WalletProviderProps) {
  const queryClient = useMemo(() => new QueryClient(), []);
  const { selectedChain, chains: allChains } = useMultichainModal();
  const chain =
    selectedChain && allChains.find((chain) => chain.id === selectedChain?.id);

  const wagmiConfig = useMemo(() => {
    if (chains.length === 0) {
      throw new Error("At least one chain must be provided");
    }

    const [firstChain, ...restChains] = chains.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return getDefaultConfig({
      appName: "Multichain Modal Example",
      projectId: "YOUR_PROJECT_ID",
      chains: [firstChain, ...restChains],
    });
  }, [chains]);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={chain?.id as unknown as number}>
          <WalletContextManager>
            <WalletConnectionManager />
            {children}
          </WalletContextManager>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
