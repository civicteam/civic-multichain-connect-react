import { configureChains, mainnet } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";

export const { chains, provider } = configureChains(
  [mainnet],
  [
    alchemyProvider({
      apiKey: "4Ow2G3LYC6SXr_AOesCG8Fi0_bxTGf1x",
      priority: 0,
    }),
  ] // TODO: Inject providers here
);

export const APP_NAME = "MULTICHAIN_WALLET_CONNECT";
