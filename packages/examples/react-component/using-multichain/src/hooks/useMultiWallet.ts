import { EthereumGatewayWallet } from "@civic/ethereum-gateway-react";
import { useWallet, useChain } from "@civic/multichain-connect-react-core";
import { useState, useEffect } from "react";
import { useWalletClient } from "wagmi";
import { walletClientToSigner } from "./useAdapters";

export interface MultiWalletContextState {
  connected: boolean;
  evmGatewayWallet: EthereumGatewayWallet | undefined;
}

export const useMultiWallet = (): MultiWalletContextState => {
  const [evmGatewayWallet, setEvmGatewayWallet] = useState<
    EthereumGatewayWallet | undefined
  >();
  const { connected } = useWallet();
  const { selectedChain } = useChain();

  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    console.log(">>> walletClient", walletClient);

    // the wallet client chain is set asynchronously, so wait until
    // it's set before setting the wallet
    if (!walletClient?.chain) {
      setEvmGatewayWallet(undefined);
      return;
    }
    if (walletClient && walletClient?.account) {
      const signer = walletClientToSigner(
        walletClient
      ) as never as EthereumGatewayWallet["signer"];
      setEvmGatewayWallet({ address: walletClient.account?.address, signer });
    }
  }, [walletClient, selectedChain]);

  return {
    connected,
    evmGatewayWallet,
  };
};
