import "./App.css";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { goerli, mainnet } from "wagmi/chains";

import WagmiGateway from "./WagmiGateway";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

function App() {
  const { publicClient, webSocketPublicClient, chains } = configureChains(
    [goerli, mainnet], // Things start to break if you only have one chain here.
    [publicProvider()]
  );

  const config = createConfig({
    publicClient,
    webSocketPublicClient,
    connectors: [
      new MetaMaskConnector({ chains }),
      new WalletConnectConnector({
        chains,
        options: {
          projectId: "cb15f45a4b51799ebac3155e52fa5129",
        },
      }),
      new InjectedConnector({
        chains,
        options: {
          name: "Injected",
          shimDisconnect: true,
        },
      }),
    ],
  });

  return (
    <>
      <h2>Wagmi without RC</h2>
      <span>
        This only works with the Goerli network and does not include automatic
        switching of Metamask to that network. Ensure your metamask network is
        already set to Goerli.
      </span>
      <br />
      <br />
      <div className="card">
        <WagmiConfig config={config}>
          <WagmiGateway />
        </WagmiConfig>
      </div>
    </>
  );
}

export default App;
