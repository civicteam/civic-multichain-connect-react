/* eslint-disable require-extensions/require-extensions */
import React, { useMemo } from "react";
import {
  ChainType,
  MultichainConnectButton,
  MultichainProvider,
  useMultichainModal,
} from "@civic/multichain-modal";
import { mainnet, goerli } from "wagmi/chains";
import {
  WalletProvider as RainbowKitProvider,
  useEthereumWallet,
  SolanaWalletProvider,
} from "./wallet-providers/index";
import { RainbowKitConnectedButton } from "./wallet-providers/ethereum/RainbowKitConnectedButton";

function ExampleApp() {
  const { selectedChain } = useMultichainModal();
  const ethereumWallet = useEthereumWallet();

  const { isConnected, address } = ethereumWallet;

  return (
    <div className="App min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Multichain Modal Example
      </h1>
      <MultichainConnectButton />
      <RainbowKitConnectedButton />
      {isConnected && selectedChain && (
        <div className="mt-8 p-4 bg-white rounded shadow">
          <h2 className="text-2xl font-semibold mb-4">
            Connected to {selectedChain.name}
          </h2>
          <p>Chain ID: {selectedChain.id}</p>
          <p>Chain Type: {selectedChain.type}</p>
          <p>Testnet: {selectedChain.testnet ? "Yes" : "No"}</p>
          <p>Address: {address}</p>
        </div>
      )}
    </div>
  );
}

function App() {
  const ethereumChains = useMemo(() => [mainnet, goerli], []);
  const solanaChains = useMemo(
    () => [
      {
        id: "solana-mainnet",
        name: "Solana",
        rpcEndpoint: "https://api.mainnet-beta.solana.com",
        type: ChainType.Solana,
      },
      {
        id: "solana-devnet",
        name: "Solana Devnet",
        rpcEndpoint: "https://api.devnet.solana.com",
        type: ChainType.Solana,
      },
    ],
    []
  );

  return (
    <RainbowKitProvider chains={ethereumChains}>
      <SolanaWalletProvider chains={solanaChains}>
        <ExampleApp />
      </SolanaWalletProvider>
    </RainbowKitProvider>
  );
}

export default App;
