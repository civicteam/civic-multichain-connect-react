import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { ConnectionState, useMultichainModal } from "@civic/multichain-modal";

export function SolanaWalletConnectedButton(): JSX.Element | null {
  const { connected } = useWallet();
  const { walletConnections } = useMultichainModal();
  const connectionState = walletConnections.solana;

  if (!connected || connectionState !== ConnectionState.Connected) {
    return null;
  }

  return (
    <>
      <WalletMultiButton />
    </>
  );
}

SolanaWalletConnectedButton.defaultProps = {
  children: <WalletMultiButton />,
};
