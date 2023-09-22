import { Chain as WagmiChain } from "wagmi/chains";

export type Chain = WagmiChain;
export type RainbowkitConfigOptions = {
  appName: string;
  walletConnectProjectId: string;
  showBalance?: boolean;
};
