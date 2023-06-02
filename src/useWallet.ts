/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect } from "react";
import { ChainSelectorModalContext } from "./chainSelector/ChainSelectorProvider";
import { RainbowkitWalletContext } from "./ethereum/rainbowkit/RainbowkitWalletProvider";
import { SolanaWalletAdapterContext } from "./solana/solanaWalletAdapter/SolanaWalletAdapterProvider";
import { WalletContextType } from "./types";

const useMultichainWallet = (): WalletContextType => {
  const ethContext = useContext(RainbowkitWalletContext);
  const solanaContext = useContext(SolanaWalletAdapterContext);
  const chainContext = useContext(ChainSelectorModalContext);
  const connected = ethContext.connected || solanaContext.connected;
  const wallet = ethContext.wallet || solanaContext.wallet;
  const { chain } = chainContext;
  const disconnect = ethContext.connected
    ? ethContext.disconnect
    : solanaContext.disconnect;

  return {
    wallet,
    connected,
    chain,
    disconnect,
  };
};

export default useMultichainWallet;
