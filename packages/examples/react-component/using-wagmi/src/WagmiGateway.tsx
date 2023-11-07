import { GatewayProvider, IdentityButton } from "@civic/ethereum-gateway-react";
import { useMultiWallet } from "./hooks/useMultiWallet";
import {
  useAccount,
  useNetwork,
  useConnect,
  useDisconnect,
  useEnsName,
} from "wagmi";

export default function WagmiGateway() {
  const { evmGatewayWallet } = useMultiWallet();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  const { data: ensName } = useEnsName({ address });
  const { disconnect } = useDisconnect();
  // const { connect, connectors } = useConnect();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
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
          <>
            {connectors.map((connector) => (
              <>
                <button
                  disabled={!connector.ready}
                  key={connector.id}
                  onClick={() => connect({ connector })}
                >
                  {connector.name}
                  {!connector.ready && " (unsupported)"}
                  {isLoading &&
                    connector.id === pendingConnector?.id &&
                    " (connecting)"}
                </button>
                <br />
              </>
            ))}
          </>
          // <button onClick={() => connect({ connector: connectors[0] })}>
          //   Connect Wallet
          // </button>
        )}
      </GatewayProvider>
    </>
  );
}
