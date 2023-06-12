import { SupportedChains, WalletContextType } from "./types.js";
import useWalletAdapters from "./useWalletAdapters.js";

const useMultichainWallet = <
  T extends SupportedChains,
  S,
  E
>(): WalletContextType<T, S, E> => {
  const { getWalletAdapters } = useWalletAdapters<T, S, E>();
  const adapters = getWalletAdapters().map((a) => a.context);
  const adapter = adapters.find((a) => a?.connected);

  return {
    wallet: adapter?.wallet,
    connected: adapter?.connected ?? false,
    disconnect: adapter?.disconnect,
    chain: adapter?.chain,
  };
};

export default useMultichainWallet;
