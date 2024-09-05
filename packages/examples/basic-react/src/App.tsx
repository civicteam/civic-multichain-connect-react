/* eslint-disable require-extensions/require-extensions */
import React from "react";
import "./App.css";
import "@civic/ui/styles.css";
import {
  MultichainConnectButton,
  MultichainWalletProvider,
} from "@civic/multichain-connect-react-core";
import { clusterApiUrl } from "@solana/web3.js";
import { SolanaWalletAdapterConfig } from "@civic/multichain-connect-react-solana-wallet-adapter";
import { RainbowkitConfig } from "@civic/multichain-connect-react-rainbowkit-wallet-adapter";
import {
  mainnet,
  sepolia,
  polygon,
  arbitrum,
  arbitrumSepolia,
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
const defaultEvmTestChains = [polygonMumbai, sepolia, arbitrumSepolia];

const Content = () => {
  return (
    <MultichainWalletProvider>
      <RainbowkitConfig
        chains={defaultEvmChains}
        testnetChains={defaultEvmTestChains}
        options={{
          // Rainbowkit relies on WalletConnect which now needs to obtain a projectId from WalletConnect Cloud.
          // Put this in your .env file as REACT_APP_WALLET_CONNECT_PROJECT_ID=...
          appName: "Example App",
          walletConnectProjectId: `${process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID}`,
          chainStatus: "none",
          label: "Connect Wallet",
          showBalance: true,
          modalSize: "compact",
        }}
      >
        <SolanaWalletAdapterConfig
          chains={defaultSolanaChains}
          testnetChains={defaultSolanaTestChains}
          adapters={[]}
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
