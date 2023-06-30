/* eslint-disable require-extensions/require-extensions */
import React, { useEffect, useState } from "react";
import "./App.css";
import {
  BaseChain,
  MultichainConnectButton,
  MultichainWalletProvider,
  SupportedChains,
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
  useRainbowkitWalletAdapterProvider,
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

const StyledTableHeader = styled.th`
  padding: 0 10px;
`;

const StyledTableData = styled.td`
  padding: 0 10px;
`;

function Content() {
  const [evmAddress, setEvmAddress] = useState<string | undefined>();

  const solanaWallet = useSolanaWalletAdapterProvider();
  const evmWallet = useRainbowkitWalletAdapterProvider();

  useEffect(() => {
    const fetchAddress = async () => {
      const address = await evmWallet.wallet?.getAddress();
      setEvmAddress(address);
    };

    if (evmWallet && evmWallet.connected) {
      fetchAddress();
    } else {
      setEvmAddress(undefined);
    }
  }, [evmWallet]);

  return (
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
            {solanaWallet && solanaWallet.connected
              ? "Connected"
              : "Not Connected"}
          </StyledTableData>
          <StyledTableData>
            {solanaWallet?.wallet?.publicKey?.toBase58() || "N/A"}
          </StyledTableData>
        </tr>
        <tr>
          <StyledTableData>EVM</StyledTableData>
          <StyledTableData>
            {evmWallet && evmWallet.connected ? "Connected" : "Not Connected"}
          </StyledTableData>
          <StyledTableData>{evmAddress || "N/A"}</StyledTableData>
        </tr>
      </tbody>
    </table>
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
