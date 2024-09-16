import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useMultichainModal } from "@civic/multichain-modal";

export const RainbowKitConnectedButton: React.FC<
  React.ComponentProps<typeof ConnectButton>
> = (props) => {
  const { isConnected } = useAccount();
  const { connectionState } = useMultichainModal();

  if (isConnected && connectionState === "connected") {
    return <ConnectButton {...props} />;
  }

  return null;
};
