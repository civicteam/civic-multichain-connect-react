import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useMultichainModal } from "@civic/multichain-modal";

export function SolanaWalletConnectedButton(): JSX.Element | null {
  const { connected } = useWallet();
  const { connectionState } = useMultichainModal();

  if (!connected || connectionState !== "connected") {
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
