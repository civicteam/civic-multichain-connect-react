/* eslint-disable require-extensions/require-extensions */
import React, { useEffect, useState } from "react";
import "./App.css";
import {
  MultichainConnectButton,
  MultichainWalletProvider,
} from "@civic/multichain-connect-react-core";
import { clusterApiUrl } from "@solana/web3.js";
import {
  Chain as SolanaChain,
  SolanaWalletAdapterConfig,
} from "@civic/multichain-connect-react-solana-wallet-adapter";
import {
  Chain as EthereumChain,
  RainbowkitConfig,
} from "@civic/multichain-connect-react-rainbowkit-wallet-adapter";
import { publicProvider } from "wagmi/providers/public";
import {
  mainnet,
  goerli,
  polygon,
  arbitrum,
  arbitrumGoerli,
  polygonMumbai,
} from "wagmi/chains";
import { useHash } from "./hooks/useHash";

function App() {
  const defaultEvmChains = [
    polygon,
    polygonMumbai,
    mainnet,
    goerli,
    arbitrum,
    arbitrumGoerli,
  ];

  const solanaMainnetChain = {
    name: "Solana",
    rpcEndpoint: clusterApiUrl("mainnet-beta"),
  };
  const solanaDevnetChain = {
    name: "Solana Devnet",
    rpcEndpoint: clusterApiUrl("devnet"),
  };

  const defaultSolanaChains = [solanaMainnetChain, solanaDevnetChain];

  const { hash } = useHash();
  const [solanaInitialChain, setSolanaInitialChain] = useState<
    SolanaChain | undefined
  >(undefined);
  const [evmInitialChain, setEvmInitialChain] = useState<
    EthereumChain | undefined
  >(undefined);
  const [evmChains, setEvmChains] = useState<EthereumChain[]>(defaultEvmChains);
  const [solanaChains, setSolanaChains] =
    useState<SolanaChain[]>(defaultSolanaChains);

  // If the url contains a hash, filter the chains to only show the selected chain for evm
  useEffect(() => {
    if (!hash) {
      setEvmChains(defaultEvmChains);
      setSolanaChains(defaultSolanaChains);
      return;
    }

    const decodedKey = decodeURIComponent(hash);
    const formattedChainName =
      decodedKey.charAt(0).toUpperCase() + decodedKey.slice(1);
    document.title = `Sample: ${formattedChainName}`;

    const selectedEvmChain = defaultEvmChains.filter(
      (c) => c.name.toLowerCase() === decodedKey
    )[0];
    if (selectedEvmChain) {
      setEvmInitialChain(selectedEvmChain);
      setSolanaInitialChain(undefined);
      setEvmChains(defaultEvmChains);
      setSolanaChains([]);
      return;
    }

    const selectedSolanaChain = defaultSolanaChains.filter(
      (c) => c.name.toLowerCase() === decodedKey
    )[0];
    if (selectedSolanaChain) {
      setSolanaInitialChain(selectedSolanaChain);
      setEvmInitialChain(undefined);
      setSolanaChains(defaultSolanaChains);
      setEvmChains([]);
      return;
    }

    setEvmChains([]);
    setSolanaChains([]);
  }, [hash]);

  return (
    <div className="App">
      <header className="App-header">
        <MultichainWalletProvider>
          <RainbowkitConfig
            chains={evmChains}
            providers={[publicProvider()]}
            initialChain={evmInitialChain}
          >
            <SolanaWalletAdapterConfig
              chains={solanaChains}
              initialChain={solanaInitialChain}
            >
              <MultichainConnectButton />
            </SolanaWalletAdapterConfig>
          </RainbowkitConfig>
        </MultichainWalletProvider>
      </header>
    </div>
  );
}

export default App;
