import {
  SupportedChains,
  useWallet,
} from "@civic/multichain-connect-react-core";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Wallet as EthersWallet } from "ethers";
import { useState, useEffect } from "react";

export interface MultiWalletContextState {
  connected: boolean;
  solanaWallet?: WalletContextState;
  ethersWallet?: EthersWallet;
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

  const { wallet: ethersWallet } = useWallet<
    SupportedChains.Ethereum,
    never,
    EthersWallet
  >();

  useEffect(() => {
    if (solanaWallet?.publicKey) {
      setAddress(solanaWallet.publicKey.toBase58());
    }
  }, [solanaWallet]);

  useEffect(() => {
    if (ethersWallet?.getAddress) {
      ethersWallet?.getAddress().then((address) => {
        setAddress(address);
      });
    }
  }, [ethersWallet]);

  return {
    connected,
    address,
    solanaWallet: solanaWallet?.publicKey ? solanaWallet : undefined,
    ethersWallet: ethersWallet?.getAddress ? ethersWallet : undefined,
  };
};
