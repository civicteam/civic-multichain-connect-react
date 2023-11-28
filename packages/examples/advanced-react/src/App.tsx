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
  useSolanaWalletAdapterModal,
} from "@civic/multichain-connect-react-solana-wallet-adapter";
import {
  Chain as EthereumChain,
  RainbowkitConfig,
  useRainbowkitAdapterModal,
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
import styled from "styled-components";
import { useMultiWallet } from "./hooks/useWallet";

const StyledTableHeader = styled.th`
  padding: 0 10px;
`;

const StyledTableData = styled.td`
  padding: 0 10px;
`;

function Content() {
  const { solanaWallet, evmWallet, address } = useMultiWallet();
  const { openConnectModal: openSolanaConnectModal } =
    useSolanaWalletAdapterModal();
  const { openConnectModal: openRainbowkitModal } = useRainbowkitAdapterModal();
  return (
    <>
      <div>
        <button onClick={() => openSolanaConnectModal?.()}>
          Open Solana Modal
        </button>
        <button onClick={() => openRainbowkitModal?.()}>
          Open Rainbowkit Modal
        </button>
      </div>
      <table style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <StyledTableHeader>Wallet Type</StyledTableHeader>
            <StyledTableHeader>Connection Status</StyledTableHeader>
            <StyledTableHeader>Wallet Address</StyledTableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <StyledTableData>Solana</StyledTableData>
            <StyledTableData>
              {solanaWallet ? "Connected" : "Not Connected"}
            </StyledTableData>
            <StyledTableData>{solanaWallet ? address : "N/A"}</StyledTableData>
          </tr>
          <tr>
            <StyledTableData>EVM</StyledTableData>
            <StyledTableData>
              {evmWallet ? "Connected" : "Not Connected"}
            </StyledTableData>
            <StyledTableData>{evmWallet ? address : "N/A"}</StyledTableData>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function App() {
  const defaultEvmChains: EthereumChain[] = [polygon, mainnet, arbitrum];
  const defaultEvmTestChains: EthereumChain[] = [
    polygonMumbai,
    goerli,
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

  const defaultSolanaChains: SolanaChain[] = [solanaMainnetChain];
  const defaultSolanaTestChains: SolanaChain[] = [solanaDevnetChain];

  const { hash } = useHash();

  const [initialChain, setInitialChain] = useState<EthereumChain | undefined>(
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

  const filterChain =
    (name: string) => (chain: EthereumChain | SolanaChain) => {
      return chain.name.toLowerCase() === name;
    };

  // If the url contains a hash, filter the chains to only show the selected chain for evm
  useEffect(() => {
    if (!hash) return;

    const decodedKey = decodeURIComponent(hash);
    const formattedChainName =
      decodedKey.charAt(0).toUpperCase() + decodedKey.slice(1);
    document.title = `Sample: ${formattedChainName}`;

    setEvmChains({
      chains: defaultEvmChains.filter(filterChain(decodedKey)),
      testChains: defaultEvmTestChains.filter(filterChain(decodedKey)),
    });

    setSolanaChains({
      chains: defaultSolanaChains.filter(filterChain(decodedKey)),
      testChains: defaultSolanaTestChains.filter(filterChain(decodedKey)),
    });

    setInitialChain(
      [...defaultEvmChains, ...defaultEvmTestChains].find(
        filterChain(decodedKey)
      )
    );
  }, [hash]);

  useEffect(() => {
    if (hash) return;

    setEvmChains({
      chains: defaultEvmChains,
      testChains: defaultEvmTestChains,
    });
    setSolanaChains({
      chains: defaultSolanaChains,
      testChains: defaultSolanaTestChains,
    });
  }, [hash]);

  return (
    <div className="App">
      <header className="App-header">
        <MultichainWalletProvider>
          <RainbowkitConfig
            chains={evmChains.chains}
            testnetChains={evmChains.testChains}
            providers={[publicProvider()]}
            enableChainSwitch={false}
            options={{
              // Rainbowkit relies on WalletConnect which now needs to obtain a projectId from WalletConnect Cloud.
              // Put this in your .env file as REACT_APP_WALLET_CONNECT_PROJECT_ID=...
              appName: "Example App",
              walletConnectProjectId: `${process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID}`,
            }}
            initialChain={initialChain}
          >
            <SolanaWalletAdapterConfig
              chains={solanaChains.chains}
              testnetChains={solanaChains.testChains}
              adapters={[]}
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
