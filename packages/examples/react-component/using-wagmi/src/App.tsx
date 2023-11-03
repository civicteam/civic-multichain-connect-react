import "./App.css";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { goerli } from "wagmi/chains";

import WagmiGateway from "./WagmiGateway";
import { PhantomConnector } from "phantom-wagmi-connector";
import { publicProvider } from "wagmi/providers/public";

function App() {
  const { publicClient, webSocketPublicClient, chains } = configureChains(
    [goerli],
    [publicProvider()]
  );

  const config = createConfig({
    publicClient,
    webSocketPublicClient,
    connectors: [new PhantomConnector({ chains })],
  });

  return (
    <>
      <h2>React Component with Wagmi</h2>
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
