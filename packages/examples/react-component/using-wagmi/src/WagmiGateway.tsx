import { GatewayProvider, IdentityButton } from "@civic/ethereum-gateway-react";
import { useMultiWallet } from "./hooks/useMultiWallet";
import {
  useAccount,
  useNetwork,
  useConnect,
  useDisconnect,
  useEnsName,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

export default function WagmiGateway() {
  const { evmGatewayWallet } = useMultiWallet();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  const { data: ensName } = useEnsName({ address });
  const { disconnect } = useDisconnect();
  // const { connect, connectors } = useConnect();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  console.log(">>> evmGatewayWallet", evmGatewayWallet);
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
              Connected to {ensName ?? address} on {chain?.name || "unknown"}
            </div>
            <br />
            <button onClick={() => disconnect()}>Disconnect</button>
            <br />
            <IdentityButton />
          </>
        ) : (
          <button onClick={() => connect()}>Connect Wallet</button>
        )}
      </GatewayProvider>
    </>
  );
}
