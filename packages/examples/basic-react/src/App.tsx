/* eslint-disable require-extensions/require-extensions */
import React from "react";
import "./App.css";
import {
  MultichainConnectButton,
  MultichainWalletProvider,
} from "@civic/multichain-connect-react-core";
import { Connection, clusterApiUrl } from "@solana/web3.js";
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

const clientChains = [
  polygon,
  polygonMumbai,
  mainnet,
  goerli,
  arbitrum,
  arbitrumGoerli,
];

const defaultSolanaChains = [
  { name: "Solana", connection: new Connection(clusterApiUrl("devnet")) },
];

const Content = () => {
  return (
    <MultichainWalletProvider>
      <RainbowkitConfig chains={clientChains} providers={[publicProvider()]}>
        <SolanaWalletAdapterConfig chains={defaultSolanaChains}>
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
