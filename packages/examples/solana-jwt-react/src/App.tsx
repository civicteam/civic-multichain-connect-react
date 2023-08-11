/* eslint-disable require-extensions/require-extensions */
import React, { useEffect, useMemo } from "react";
import "./App.css";
import useSWR from "swr";
import {
  MultichainConnectButton,
  MultichainWalletProvider,
} from "@civic/multichain-connect-react-core";
import { ConnectionConfig, PublicKey, clusterApiUrl } from "@solana/web3.js";
import {
  SolanaWalletAdapterConfig,
  Chain as SolanaChain,
  useSolanaWalletAdapterProvider,
} from "@civic/multichain-connect-react-solana-wallet-adapter";
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
import styled from "styled-components";
import { useMultiWallet } from "./hooks/useWallet";

const StyledTableHeader = styled.th`
  padding: 0 10px;
`;

const StyledTableData = styled.td`
  padding: 0 10px;
`;
const defaultEvmChains = [polygon, mainnet, arbitrum];
const defaultEvmTestChains = [polygonMumbai, goerli, arbitrumGoerli];

const InnerContent = () => {
  const { solanaWallet, ethersWallet, address } = useMultiWallet();
  const [connectedBalance, setConnectedBalance] = React.useState<string | null>(
    null
  );
  const { connection, connected } = useSolanaWalletAdapterProvider();

  useEffect(() => {
    const getBalance = async () => {
      console.log("getBalance", { connection, connected, address });
      if (connection && connected && address) {
        const balance = await connection.getBalance(new PublicKey(address));
        setConnectedBalance(`${balance}`);
      }
    };
    getBalance();
  }, [connection?.rpcEndpoint, connected, address]);

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
            {solanaWallet ? "Connected" : "Not Connected"}
            &nbsp;Balance: {connectedBalance}
          </StyledTableData>
          <StyledTableData>{solanaWallet ? address : "N/A"}</StyledTableData>
        </tr>
        <tr>
          <StyledTableData>EVM</StyledTableData>
          <StyledTableData>
            {ethersWallet ? "Connected" : "Not Connected"}
          </StyledTableData>
          <StyledTableData>{ethersWallet ? address : "N/A"}</StyledTableData>
        </tr>
      </tbody>
    </table>
  );
};
const Content = () => {
  // Refresh token for persisting session
  const { data: solanaAuthToken } = useSWR(
    `${process.env.REACT_APP_AUTH_BACKEND}`,
    (url) =>
      fetch(url)
        .then((res) => res.json())
        .then((res) => res.access_token),
    {
      // Silently refresh token every expiry time
      refreshInterval: 1000 * 60 * 15,
      revalidateOnFocus: false,
    }
  );

  console.log("solanaAuthToken", {
    solanaAuthToken,
  });

  const solanaAuthFetchFn = useMemo(() => {
    return (
      input: RequestInfo,
      init?: RequestInit | undefined
    ): Promise<Response> => {
      const inHeaders = init?.headers || new Headers();
      const headers = {
        ...inHeaders,
        Authorization: `Bearer ${solanaAuthToken}`,
      };
      console.log("solanaAuthFetchFn", { input, headers });
      return fetch(
        input,
        init
          ? ({
              ...init,
              headers,
            } as RequestInit)
          : ({ headers } as RequestInit)
      ) as Promise<Response>;
    };
  }, [solanaAuthToken]);

  const solanaMainnetChain = {
    name: "Solana",
    rpcEndpoint:
      process.env.REACT_APP_SOLANA_MAINNET_RPC || clusterApiUrl("mainnet-beta"),
    commitmentOrConfig: {
      fetch: solanaAuthFetchFn,
    } as unknown as ConnectionConfig,
  } as SolanaChain;

  const solanaDevnetChain = {
    name: "Solana Devnet",
    rpcEndpoint:
      process.env.REACT_APP_SOLANA_DEVNET_RPC || clusterApiUrl("devnet"),
    commitmentOrConfig: {
      fetch: solanaAuthFetchFn,
    } as unknown as ConnectionConfig,
  } as SolanaChain;

  const defaultSolanaChains = [solanaMainnetChain];
  const defaultSolanaTestChains = [solanaDevnetChain];

  return (
    <MultichainWalletProvider>
      <RainbowkitConfig
        chains={defaultEvmChains}
        testnetChains={defaultEvmTestChains}
        providers={[publicProvider()]}
        options={{
          walletConnectProjectId: `${process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID}}`,
        }}
      >
        <SolanaWalletAdapterConfig
          chains={defaultSolanaChains}
          testnetChains={defaultSolanaTestChains}
          options={{
            walletConnectProjectId: `${process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID}}`,
          }}
        >
          <MultichainConnectButton />
          <InnerContent />
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
