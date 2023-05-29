/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from "react";
import { RainbowkitWalletContext } from "./ethereum/rainbowkit/RainbowkitWalletProvider";
import { SolanaWalletAdapterContext } from "./solana/solanaWalletAdapter/SolanaWalletAdapterProvider";
import { WalletContextType } from "./types";

const useMultichainWallet = (): WalletContextType => {
  const ethContext = useContext(RainbowkitWalletContext);
  const solanaContext = useContext(SolanaWalletAdapterContext);
  const connected = ethContext.connected || solanaContext.connected;
  const wallet = ethContext.wallet || solanaContext.wallet;

  return {
    wallet,
    connected,
  };
};

export default useMultichainWallet;
