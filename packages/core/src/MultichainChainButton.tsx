import React, { useEffect, useState } from "react";
import styled from "styled-components";
import useModal from "./useModal.js";
import useChain from "./useChain.js";
import { getIconInfo } from "@civic/civic-chain-icons";
import { SupportedChains } from "./types.js";
import {
  getNetwork,
  lookupEvmChainNetworkById,
} from "@civic/civic-eth-provider";
import { SupportedSymbol } from "@civic/civic-chain-icons";

// Styled component named StyledButton
const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  padding: 0.5rem 0;
  margin: 0.5rem 1rem;
  background: #ff6b4e;
  border: 0;
  color: black;
  cursor: pointer;
  height: 3rem;
  width: 3rem;
  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
`;
const Icon = styled.img``;

export function MultichainChainButton(): JSX.Element | null {
  const { openChainModal } = useModal();

  const { selectedChain } = useChain();

  const [iconUrl, setIconUrl] = useState<string | undefined>();
  useEffect(() => {
    if (selectedChain?.type === SupportedChains.Ethereum) {
      const chainNetwork = lookupEvmChainNetworkById(selectedChain.id ?? 0);
      if (chainNetwork) {
        setIconUrl(
          getIconInfo(getNetwork(chainNetwork)?.symbol as SupportedSymbol)?.icon
        );
      }
    } else {
      setIconUrl(getIconInfo("SOL")?.icon);
    }
  }, [selectedChain]);

  return (
    <>
      {selectedChain && (
        <StyledButton type="button" onClick={openChainModal}>
          <Icon src={iconUrl} alt={selectedChain?.name} />
        </StyledButton>
      )}
    </>
  );
}
