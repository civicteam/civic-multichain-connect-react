import { GatewayProvider, IdentityButton } from "@civic/ethereum-gateway-react";
import {
  MultichainConnectButton,
  useWallet,
} from "@civic/multichain-connect-react-core";
import { useMultiWallet } from "./hooks/useMultiWallet";

export default function MultichainGateway() {
  const { evmGatewayWallet } = useMultiWallet();
  const { connected } = useWallet();
  return (
    <>
      <MultichainConnectButton />
      <GatewayProvider
        gatekeeperNetwork={"tgnuXXNMDLK8dy7Xm1TdeGyc95MDym4bvAQCwcW21Bf"}
        wallet={evmGatewayWallet}
        stage={"dev"}
        gatekeeperSendsTransaction={false}
      >
        <br />
        <br />
        {connected && <IdentityButton />}
      </GatewayProvider>
    </>
  );
}
