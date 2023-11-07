import "./App.css";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { goerli, polygonMumbai } from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";

import {
  ConnectButton,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

import { publicProvider } from "wagmi/providers/public";

function App() {
  const { chains, publicClient } = configureChains(
    [goerli, polygonMumbai],
    [publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    projectId: "YOUR_PROJECT_ID",
    chains,
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });

  return (
    <>
      <h2>Rainbowkit without RC</h2>
      <span>
        This only works with the Goerli network and does not include automatic
        switching of Metamask to that network. Ensure your metamask network is
        already set to Goerli.
      </span>
      <br />
      <br />
      <div className="card">
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>
            <ConnectButton />
          </RainbowKitProvider>
        </WagmiConfig>
      </div>
    </>
  );
}

export default App;
