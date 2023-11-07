import {
  useAccount,
  useNetwork,
  useConnect,
  useDisconnect,
  useEnsName,
} from "wagmi";

export default function WagmiGateway() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  const { data: ensName } = useEnsName({ address });
  const { disconnect } = useDisconnect();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  return (
    <>
      {isConnected ? (
        <>
          <div>
            Connected to {ensName ?? address} on {chain?.name || "unknown"}
          </div>
          <br />
          <button onClick={() => disconnect()}>Disconnect</button>
          <br />
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
      )}
    </>
  );
}
