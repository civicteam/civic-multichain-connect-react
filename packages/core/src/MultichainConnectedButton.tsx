import useWalletAdapters from "./useWalletAdapters";

export function MultichainConnectedButton(): JSX.Element | null {
  const { getWalletAdapters } = useWalletAdapters();
  const adapter = getWalletAdapters().find((a) => a.context.connected);
  return adapter ? adapter.button : null;
}
