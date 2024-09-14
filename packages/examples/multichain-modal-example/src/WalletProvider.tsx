import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultConfig,
  RainbowKitProvider,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import { useAccount, useWalletClient, WagmiProvider } from "wagmi";
import { Chain, mainnet } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ChainType, useMultichainModal } from "@civic/multichain-modal";
import { createContext, useContext, useEffect, useMemo } from "react";

interface WalletContextType {
  isConnected: boolean;
  walletSigner: any; // Replace 'any' with a more specific type if available
  address: string | undefined;
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  walletSigner: null,
  address: undefined,
});

export const useWallet = () => useContext(WalletContext);

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

  const contextValue = useMemo(
    () => ({
      isConnected,
      walletSigner: walletClient,
      address,
    }),
    [isConnected, walletClient, address]
  );

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

export function WalletProvider({ children, chains }: WalletProviderProps) {
  const queryClient = useMemo(() => new QueryClient(), []);

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
        <RainbowKitProvider>
          <WalletContextManager>
            <WalletConnectionManager />
            {children}
          </WalletContextManager>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
