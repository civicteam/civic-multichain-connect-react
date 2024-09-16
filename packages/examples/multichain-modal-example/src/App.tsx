/* eslint-disable require-extensions/require-extensions */
import React, { useMemo } from "react";
import {
  ChainType,
  MultichainConnectButton,
  useMultichainModal,
  MultichainProvider,
} from "@civic/multichain-modal";
import { mainnet, sepolia } from "wagmi/chains";
import { useAccount, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  MultichainRainbowKitProvider,
  SolanaChain,
  MultichainSolanaProvider,
} from "./wallet-providers/index";
import { RainbowKitConnectedButton } from "./wallet-providers/ethereum/RainbowKitConnectedButton";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { SolanaWalletConnectedButton } from "./wallet-providers/solana/SolanaWalletConnectedButton";
import { useWallet } from "@solana/wallet-adapter-react";

import "@solana/wallet-adapter-react-ui/styles.css";

function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
  }
  return hash >>> 0; // Convert to unsigned 32-bit integer
}

function ExampleApp() {
  const { selectedChain, getConnectionState } = useMultichainModal();
  const ethereumWallet = useAccount();
  const solanaWallet = useWallet();
  const connectionState = getConnectionState();

  return (
    <div className="App min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Multichain Modal Example
      </h1>
      <MultichainConnectButton />
      <RainbowKitConnectedButton />
      <SolanaWalletConnectedButton />
      {connectionState === "connected" && selectedChain && (
        <div className="mt-8 p-4 bg-white rounded shadow">
          <h2 className="text-2xl font-semibold mb-4">
            Connected to {selectedChain.name}
          </h2>
          <p>Chain ID: {selectedChain.id}</p>
          <p>Chain Type: {selectedChain.type}</p>
          <p>Testnet: {selectedChain.testnet ? "Yes" : "No"}</p>
          <p>
            Address:{" "}
            {ethereumWallet.address || solanaWallet?.publicKey?.toString()}
          </p>
        </div>
      )}
    </div>
  );
}

function App() {
  const ethereumChains = useMemo(() => [mainnet, sepolia], []);
  const solanaChains = useMemo(
    () => [
      {
        id: hashString("Solana"),
        name: "Solana",
        rpcEndpoint: "https://api.mainnet-beta.solana.com",
        type: ChainType.Solana,
        testnet: false,
        iconUrl: "/solana.svg",
      },
      {
        id: hashString("Solana Devnet"),
        name: "Solana Devnet",
        rpcEndpoint: "https://api.devnet.solana.com",
        type: ChainType.Solana,
        testnet: true,
        iconUrl: "/solana.svg",
      },
    ],
    []
  ) as SolanaChain[];

  const wagmiConfig = useMemo(() => {
    if (ethereumChains.length === 0) {
      throw new Error("At least one chain must be provided");
    }

    const [firstChain, ...restChains] = ethereumChains.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return getDefaultConfig({
      appName: "Multichain Modal Example",
      projectId: "YOUR_PROJECT_ID",
      chains: [firstChain, ...restChains],
    });
  }, [ethereumChains]);

  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <MultichainProvider>
          <MultichainRainbowKitProvider chains={ethereumChains}>
            <MultichainSolanaProvider chains={solanaChains}>
              <ExampleApp />
            </MultichainSolanaProvider>
          </MultichainRainbowKitProvider>
        </MultichainProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
