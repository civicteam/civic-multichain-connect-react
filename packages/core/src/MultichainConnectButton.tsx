import React from "react";
import styled from "styled-components";
import useModal from "./useModal.js";
import { LabelEntry } from "./types.js";
import { useLabel } from "./MultichainLabelProvider.js";
import useWallet from "./useWallet.js";
import { MultichainConnectedButton } from "./MultichainConnectedButton.js";

// Styled component named StyledButton
const StyledButton = styled.button`
  display: inline-block;
  border-radius: 20px;
  padding: 0.5rem 0;
  margin: 0.5rem 1rem;
  width: 11rem;
  border: 2px solid black;
  background: white;
  color: black;
  cursor: pointer;
  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
`;

export function MultichainConnectButton(): JSX.Element | null {
  const { connected } = useWallet();
  const { openChainModal } = useModal();

  const { labels } = useLabel();
  return (
    <>
      {!connected && (
        <StyledButton type="button" onClick={openChainModal}>
          {labels[LabelEntry.CONNECT]}
        </StyledButton>
      )}
      <MultichainConnectedButton />
    </>
  );
}
