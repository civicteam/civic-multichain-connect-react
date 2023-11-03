import { WalletClient } from "wagmi";
import { BrowserProvider, JsonRpcSigner } from "ethers";

// eslint-disable-next-line import/prefer-default-export
export const walletClientToSigner = (
  walletClient: WalletClient
): JsonRpcSigner => {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain?.id,
    name: chain?.name,
    ensAddress: chain?.contracts?.ensRegistry?.address,
  };

  const provider = new BrowserProvider(transport, network);
  const signer = new JsonRpcSigner(provider, account?.address);
  return signer;
};
