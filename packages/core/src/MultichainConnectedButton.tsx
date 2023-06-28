import { styled } from "styled-components";
import { MultichainChainButton } from "./MultichainChainButton.js";
import useChain from "./useChain.js";
import useWalletAdapters from "./useWalletAdapters.js";
import React from "react";

export function MultichainConnectedButton(): JSX.Element | null {
  const { getWalletAdapters } = useWalletAdapters();

  const { selectedChain } = useChain();
  const adapter = getWalletAdapters().find((a) => {
    return selectedChain && selectedChain.type
      ? selectedChain.type === a.context.chain
      : a.context.connected;
  });
  if (!adapter || !adapter.button) return null;

  const StyledContainer = styled.div`
    display: flex;
    align-items: center;
  `;

  return (
    <StyledContainer>
      <MultichainChainButton />
      {adapter.button}
    </StyledContainer>
  );
}
