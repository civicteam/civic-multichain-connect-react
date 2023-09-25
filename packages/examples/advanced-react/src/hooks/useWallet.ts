import {
  SupportedChains,
  useWallet,
} from "@civic/multichain-connect-react-core";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { WalletClient } from "viem";
export interface MultiWalletContextState {
  connected: boolean;
  solanaWallet?: WalletContextState;
  evmWallet?: WalletClient;
  address?: string;
}

export const useMultiWallet = (): MultiWalletContextState => {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const { connected } = useWallet();

  const { wallet: solanaWallet } = useWallet<
    SupportedChains.Solana,
    WalletContextState,
    never
  >();

  const { wallet: evmWallet } = useWallet<
    SupportedChains.Ethereum,
    never,
    WalletClient
  >();

  useEffect(() => {
    if (solanaWallet?.publicKey) {
      setAddress(solanaWallet.publicKey.toBase58());
    }
  }, [solanaWallet]);

  useEffect(() => {
    if (evmWallet?.account) {
      setAddress(evmWallet?.account?.address);
    }
  }, [evmWallet]);

  return {
    connected,
    address,
    solanaWallet: solanaWallet?.publicKey ? solanaWallet : undefined,
    evmWallet: evmWallet?.account ? evmWallet : undefined,
  };
};
