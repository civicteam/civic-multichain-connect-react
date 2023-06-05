import React, { useCallback, useEffect } from "react";
import { getIconInfo, SupportedSymbol } from "@civic/civic-chain-icons";
import {
  getNetwork,
  lookupEvmChainNetworkById,
} from "@civic/civic-eth-provider";
import styled from "styled-components";
import { EVMChain } from "./types";
import useModal from "./useModal";
import useWallet from "./useWallet";

// Styled component named StyledButton
const StyledButton = styled.button`
  display: inline-block;
  border-radius: 25px;
  padding: 0.5rem;
  margin: 0.5rem 1rem;
  width: 3rem;
  border: 2px solid black;
  background: white;
  color: black;
`;

export function MultichainChainSelector(): JSX.Element | null {
  const { chain, openConnectModal } = useModal();
  const { wallet } = useWallet();
  const [iconUrl, setIconUrl] = React.useState<string | undefined>();

  const getDefaultIcon = useCallback(() => {
    const chainNetwork = (chain as EVMChain)
      ? lookupEvmChainNetworkById((chain as EVMChain).id)
      : undefined;

    if (chainNetwork) {
      const symbol = getNetwork(chainNetwork)?.symbol ?? "SOL";
      const supportedSymbol = symbol as SupportedSymbol;
      setIconUrl(getIconInfo(supportedSymbol)?.icon);
    }
  }, [chain]);

  const getIcon = useCallback(async () => {
    if (chain) {
      // if icon url is a function execute it otherwise return string value
      const url =
        typeof chain.iconUrl === "function"
          ? await chain.iconUrl()
          : chain.iconUrl;

      if (url) {
        setIconUrl(url);
        return;
      }

      getDefaultIcon();
    }
  }, [chain, getDefaultIcon]);

  useEffect(() => {
    if (chain) {
      getIcon();
    }
  }, [chain, getIcon]);

  if (!wallet && !iconUrl) {
    return null;
  }

  return (
    <StyledButton type="button" onClick={openConnectModal}>
      <img src={iconUrl} alt="" />
    </StyledButton>
  );
}
