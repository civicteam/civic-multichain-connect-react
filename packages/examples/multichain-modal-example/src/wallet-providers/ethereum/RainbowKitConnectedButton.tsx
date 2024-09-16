import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { ConnectionState, useMultichainModal } from "@civic/multichain-modal";

export const RainbowKitConnectedButton: React.FC<
  React.ComponentProps<typeof ConnectButton>
> = (props) => {
  const { isConnected } = useAccount();
  const { walletConnections } = useMultichainModal();
  const connectionState = walletConnections.ethereum;

  if (isConnected && connectionState === ConnectionState.Connected) {
    return <ConnectButton {...props} />;
  }

  return null;
};
