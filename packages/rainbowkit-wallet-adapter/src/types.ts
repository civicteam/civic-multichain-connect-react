import { Chain as WagmiChain } from "wagmi/chains";

export type Chain = WagmiChain;

export type RainbowkitConfigOptions = {
  walletConnectProjectId: string;
  showBalance?: boolean;
};
