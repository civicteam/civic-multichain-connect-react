// import { SolanaWalletAdapterConfig } from "@civic/multichain-connect-react-solana-wallet-adapter/src";
import type { FC } from "react";
import React from "react";
import { Home } from "./pages/Home";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { MultichainWalletProvider } from "@civic/multichain-connect-react-core";
import { SolanaWalletAdapterConfig } from "@civic/multichain-connect-react-solana-wallet-adapter";

const chains = [
  {
    name: "Solana",
    connection: new Connection(clusterApiUrl("mainnet-beta")),
  },
];

export const App: FC = () => {
  return (
    <MultichainWalletProvider>
      <SolanaWalletAdapterConfig chains={chains}>
        <Home />
      </SolanaWalletAdapterConfig>
    </MultichainWalletProvider>
  );
};
