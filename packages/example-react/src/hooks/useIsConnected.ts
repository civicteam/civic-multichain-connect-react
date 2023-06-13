import { useWallet } from "@civic/multichain-connect-react-core";

export function useIsConnected() {
  const { connected } = useWallet();
  return connected;
}
