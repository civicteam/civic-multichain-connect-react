import { getIconInfo, SupportedSymbol } from "@civic/civic-chain-icons";
import {
  getNetwork,
  lookupEvmChainNetworkById,
} from "@civic/civic-eth-provider";
import {
  Chain,
  ChainType,
  EVMChain,
  SolanaChain,
  SupportedChains,
} from "./types";

export const mapToEvmChain = (chain: EVMChain): Chain => {
  const chainNetwork = (chain as EVMChain)
    ? lookupEvmChainNetworkById((chain as EVMChain).id)
    : undefined;

  if (chainNetwork && !chain.iconUrl) {
    const symbol = getNetwork(chainNetwork)?.symbol ?? "";
    const supportedSymbol = symbol as SupportedSymbol;
    return {
      ...chain,
      iconUrl: getIconInfo(supportedSymbol)?.icon,
      iconBackground: "#FFF",
      type: ChainType.Ethereum,
    };
  }

  return {
    ...chain,
    type: ChainType.Ethereum,
  };
};

export const mapToSolanaChain = (chain: SolanaChain): Chain => {
  return {
    ...chain,
    iconUrl: chain.iconUrl ?? getIconInfo("SOL")?.icon,
    type: ChainType.Solana,
  };
};

export const isSolanaChain = (c?: SupportedChains): c is SolanaChain => {
  return (c as SolanaChain)?.connection !== undefined;
};

export const isEvmChain = (c?: SupportedChains): c is EVMChain => {
  return (c as EVMChain)?.id !== undefined;
};

export const getChainType = (c?: SupportedChains): ChainType => {
  if (isSolanaChain(c)) return ChainType.Solana;
  if (isEvmChain(c)) return ChainType.Ethereum;
  return ChainType.Unknown;
};
