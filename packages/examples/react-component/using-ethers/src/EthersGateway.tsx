import {
  EthereumGatewayWallet,
  GatewayProvider,
  IdentityButton,
} from "@civic/ethereum-gateway-react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default function EthersGateway() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [chain, setChain] = useState("");
  const [ensName, setEnsName] = useState<string | null>();
  const [evmGatewayWallet, setEvmGatewayWallet] = useState<
    EthereumGatewayWallet | undefined
  >();

  useEffect(() => {
    async function connectToMetaMask() {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== "undefined") {
        console.log("MetaMask is installed!");
        try {
          // Request account access if needed
          await window.ethereum.enable();
          // Create a new provider using MetaMask's provider
          // Create a signer (used to sign transactions)
          const provider = new ethers.BrowserProvider(window.ethereum);

          const signer =
            (await provider.getSigner()) as never as EthereumGatewayWallet["signer"];

          const address = await signer?.getAddress();

          setEvmGatewayWallet({ address, signer });

          console.log("Connected to MetaMask!");
          // Get the user's address
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          setAddress(accounts[0]);
          // Get the user's ENS name

          // Get the user's ENS name
          const ens = await provider.lookupAddress(accounts[0]);
          setEnsName(ens);

          const chain = await provider.getNetwork();
          setChain(chain.name);
          setIsConnected(true);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log("Install MetaMask!");
      }
    }
    connectToMetaMask();
  }, []);

  return (
    <>
      <GatewayProvider
        gatekeeperNetwork={"tgnuXXNMDLK8dy7Xm1TdeGyc95MDym4bvAQCwcW21Bf"}
        wallet={evmGatewayWallet}
        stage={"dev"}
        gatekeeperSendsTransaction={false}
      >
        {isConnected ? (
          <>
            <div>
              Connected to {ensName ?? address} on {chain}
            </div>
            {/* <br />
            <button onClick={() => disconnect()}>Disconnect</button> */}
            <br />
            <IdentityButton />
          </>
        ) : (
          // <button onClick={() => connect()}>Connect Wallet</button>
          <div>Not connected. Please connect from Metamask.</div>
        )}
      </GatewayProvider>
    </>
  );
}
