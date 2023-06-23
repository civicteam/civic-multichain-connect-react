/* eslint-disable require-extensions/require-extensions */
import React, { useEffect, useState } from "react";
import "./App.css";
import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  BaseChain,
  MultichainConnectButton,
  MultichainWalletProvider,
  SupportedChains,
  useWallet,
} from "@civic/multichain-connect-react-core";
import { clusterApiUrl } from "@solana/web3.js";
import {
  Chain as SolanaChain,
  SolanaWalletAdapterConfig,
  useSolanaWalletAdapterProvider,
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

function Content() {
  const { wallet: solanaWallet, chain: connectedChain } = useWallet<
    SupportedChains.Solana,
    WalletContextState,
    never
  >();
  const { connection } = useSolanaWalletAdapterProvider();

  return (
    <>
      {solanaWallet &&
        connection &&
        connectedChain === SupportedChains.Solana && <p>CONNECTED</p>}
    </>
  );
}

function App() {
  const defaultEvmChains = [polygon, mainnet, arbitrum];
  const defaultEvmTestChains = [polygonMumbai, goerli, arbitrumGoerli];

  const solanaMainnetChain = {
    name: "Solana",
    rpcEndpoint: clusterApiUrl("mainnet-beta"),
  };
  const solanaDevnetChain = {
    name: "Solana Devnet",
    rpcEndpoint: clusterApiUrl("devnet"),
  };

  const defaultSolanaChains = [solanaMainnetChain];
  const defaultSolanaTestChains = [solanaDevnetChain];

  const { hash } = useHash();
  const [initialChain, setInitialChain] = useState<BaseChain | undefined>(
    undefined
  );
  const [evmChains, setEvmChains] = useState<{
    chains: EthereumChain[];
    testChains: EthereumChain[];
  }>({ chains: defaultEvmChains, testChains: defaultEvmTestChains });
  const [solanaChains, setSolanaChains] = useState<{
    chains: SolanaChain[];
    testChains: SolanaChain[];
  }>({ chains: defaultSolanaChains, testChains: defaultSolanaTestChains });

  // If the url contains a hash, filter the chains to only show the selected chain for evm
  useEffect(() => {
    if (!hash) {
      setEvmChains({
        chains: defaultEvmChains,
        testChains: defaultEvmTestChains,
      });
      setSolanaChains({
        chains: defaultSolanaChains,
        testChains: defaultSolanaTestChains,
      });
      return;
    }

    const decodedKey = decodeURIComponent(hash);
    const formattedChainName =
      decodedKey.charAt(0).toUpperCase() + decodedKey.slice(1);
    document.title = `Sample: ${formattedChainName}`;

    const selectedEvmChain = [
      ...defaultEvmChains,
      ...defaultEvmTestChains,
    ].filter((c) => c.name.toLowerCase() === decodedKey)[0];
    if (selectedEvmChain) {
      setInitialChain({ ...selectedEvmChain, type: SupportedChains.Ethereum });
      setEvmChains({
        chains: defaultEvmChains,
        testChains: defaultEvmTestChains,
      });
      setSolanaChains({ chains: [], testChains: [] });
      return;
    }

    const selectedSolanaChain = [
      ...defaultSolanaChains,
      ...defaultSolanaTestChains,
    ].filter((c) => c.name.toLowerCase() === decodedKey)[0];
    if (selectedSolanaChain) {
      setInitialChain({ ...selectedSolanaChain, type: SupportedChains.Solana });
      setSolanaChains({
        chains: defaultSolanaChains,
        testChains: defaultSolanaTestChains,
      });
      setEvmChains({ chains: [], testChains: [] });
      return;
    }

    setEvmChains({ chains: [], testChains: [] });
    setSolanaChains({ chains: [], testChains: [] });
  }, [hash]);

  return (
    <div className="App">
      <header className="App-header">
        <MultichainWalletProvider initialChain={initialChain}>
          <RainbowkitConfig
            chains={evmChains.chains}
            testnetChains={evmChains.testChains}
            providers={[publicProvider()]}
            options={{
              // Rainbowkit relies on WalletConnect which now needs to obtain a projectId from WalletConnect Cloud.
              walletConnectProjectId: "*YOUR WALLET CONNECT PROJECT ID*",
            }}
          >
            <SolanaWalletAdapterConfig
              chains={solanaChains.chains}
              testnetChains={solanaChains.testChains}
            >
              <MultichainConnectButton />
              <Content />
            </SolanaWalletAdapterConfig>
          </RainbowkitConfig>
        </MultichainWalletProvider>
      </header>
    </div>
  );
}

export default App;
