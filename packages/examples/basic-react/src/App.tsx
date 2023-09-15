/* eslint-disable require-extensions/require-extensions */
import React from "react";
import "./App.css";
import {
  MultichainConnectButton,
  MultichainWalletProvider,
} from "@civic/multichain-connect-react-core";
import { clusterApiUrl } from "@solana/web3.js";
import { SolanaWalletAdapterConfig } from "@civic/multichain-connect-react-solana-wallet-adapter";
import { publicProvider } from "wagmi/providers/public";
import { RainbowkitConfig } from "@civic/multichain-connect-react-rainbowkit-wallet-adapter";
import {
  mainnet,
  goerli,
  polygon,
  arbitrum,
  arbitrumGoerli,
  polygonMumbai,
} from "wagmi/chains";

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

const defaultEvmChains = [polygon, mainnet, arbitrum];
const defaultEvmTestChains = [polygonMumbai, goerli, arbitrumGoerli];

const Content = () => {
  return (
    <MultichainWalletProvider>
      <RainbowkitConfig
        chains={defaultEvmChains}
        testnetChains={defaultEvmTestChains}
        providers={[publicProvider()]}
        options={{
          // Rainbowkit relies on WalletConnect which now needs to obtain a projectId from WalletConnect Cloud.
          // Put this in your .env file as REACT_APP_WALLET_CONNECT_PROJECT_ID=...
          walletConnectProjectId: `${process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID}`,
        }}
      >
        <SolanaWalletAdapterConfig
          chains={defaultSolanaChains}
          testnetChains={defaultSolanaTestChains}
          options={{
            walletConnectProjectId: `${process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID}`,
          }}
        >
          <MultichainConnectButton />
        </SolanaWalletAdapterConfig>
      </RainbowkitConfig>
    </MultichainWalletProvider>
  );
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Content />
      </header>
    </div>
  );
}

export default App;
