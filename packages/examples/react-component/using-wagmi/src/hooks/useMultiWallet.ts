import { EthereumGatewayWallet } from "@civic/ethereum-gateway-react";
import { useAccount } from "wagmi";
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
  const { isConnected: connected } = useAccount();
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    // the wallet client chain is set asynchronously, so wait until
    // it's set before setting the wallet
    console.log(">>> walletClient", walletClient);
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
  }, [walletClient]);

  return {
    connected,
    evmGatewayWallet,
  };
};
