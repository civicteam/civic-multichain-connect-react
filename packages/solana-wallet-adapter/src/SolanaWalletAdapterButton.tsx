import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function SolanaWalletAdapterButton(): JSX.Element | null {
  const { connected } = useWallet();

  if (!connected) {
    return null;
  }

  return (
    <>
      <WalletMultiButton />
    </>
  );
}

SolanaWalletAdapterButton.defaultProps = {
  children: <WalletMultiButton />,
};
