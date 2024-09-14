/* eslint-disable require-extensions/require-extensions */
import React, { useEffect, useMemo } from "react";
import {
  Chain,
  ChainType,
  MultichainConnectButton,
  MultichainModalProvider,
  useMultichainModal,
} from "@civic/multichain-modal";
import { mainnet, goerli } from "wagmi/chains";
import { WalletProvider, useWallet } from "./WalletProvider";

function ExampleApp() {
  const { registerChains, selectedChain } = useMultichainModal();
  const { isConnected, address } = useWallet();

  useEffect(() => {
    registerChains([
      {
        id: mainnet.id.toString(),
        name: mainnet.name,
        type: ChainType.Ethereum,
        testnet: false,
        iconUrl: "/ethereum.svg",
      },
      {
        id: goerli.id.toString(),
        name: goerli.name,
        type: ChainType.Ethereum,
        testnet: true,
        iconUrl: "/ethereum.svg",
      },
      {
        id: "solana-mainnet",
        name: "Solana",
        type: ChainType.Solana,
        testnet: false,
        iconUrl: "/solana.svg",
      },
      {
        id: "solana-devnet",
        name: "Solana Devnet",
        type: ChainType.Solana,
        testnet: true,
        iconUrl: "/solana.svg",
      },
    ]);
  }, [registerChains]);

  return (
    <div className="App min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Multichain Modal Example
      </h1>
      <MultichainConnectButton />
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
  const chains = useMemo(() => [mainnet, goerli], []);

  return (
    <MultichainModalProvider>
      <WalletProvider chains={chains}>
        <ExampleApp />
      </WalletProvider>
    </MultichainModalProvider>
  );
}

export default App;
