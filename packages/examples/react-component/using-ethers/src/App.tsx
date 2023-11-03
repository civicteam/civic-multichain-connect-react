import "./App.css";
import EthersGateway from "./EthersGateway";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum: any;
  }
}

function App() {
  return (
    <>
      <h2>React Component with Ethers</h2>
      <span>
        This only works with the Goerli network and does not include automatic
        switching of Metamask to that network. Ensure your metamask network is
        already set to Goerli.
      </span>
      <br />
      <br />
      <div className="card">
        <EthersGateway />
      </div>
    </>
  );
}

export default App;
