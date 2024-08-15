export type RainbowkitConfigOptions = {
  appName: string;
  walletConnectProjectId: string;
  showBalance?: boolean;
  chainStatus?: "full" | "icon" | "name" | "none";
  accountStatus?: "full" | "avatar" | "address";
  label?: string;
};
