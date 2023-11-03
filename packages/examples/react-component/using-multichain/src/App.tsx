import { RainbowkitConfig } from "@civic/multichain-connect-react-rainbowkit-wallet-adapter";
import "./App.css";
import { MultichainWalletProvider } from "@civic/multichain-connect-react-core";
import { publicProvider } from "wagmi/providers/public";
import { goerli } from "wagmi/chains";
import MultichainGateway from "./MultichainGateway";

function App() {
  const defaultEvmTestChains = [goerli];

  return (
    <>
      <h2>React Component with Multichain-connect</h2>
      <div className="card">
        <MultichainWalletProvider>
          <RainbowkitConfig
            chains={[]}
            testnetChains={defaultEvmTestChains}
            providers={[publicProvider()]}
            options={{
              appName: "rainbowkit",
              walletConnectProjectId: "cb15f45a4b51799ebac3155e52fa5129",
            }}
          >
            <MultichainGateway />
          </RainbowkitConfig>
        </MultichainWalletProvider>
      </div>
    </>
  );
}

export default App;
