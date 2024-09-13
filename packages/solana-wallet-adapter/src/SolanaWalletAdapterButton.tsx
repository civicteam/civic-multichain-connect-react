import React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function SolanaWalletAdapterButton(): JSX.Element | null {
  return <WalletMultiButton />;
}

SolanaWalletAdapterButton.defaultProps = {
  children: <WalletMultiButton />,
};
