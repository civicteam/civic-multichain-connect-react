import React from "react";
// import React, { useEffect } from "react";
import styled from "styled-components";
import useModal from "./useModal";
import { LabelEntry } from "./types";
import { useLabel } from "./LabelProvider";
import useWallet from "./useWallet";
import { MultichainConnectedButton } from "./MultichainConnectedButton";

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
`;

export function MultichainConnectButton(): JSX.Element | null {
  const { connected } = useWallet();
  const { openConnectModal } = useModal();

  const { labels } = useLabel();
  return (
    <>
      {!connected && (
        <StyledButton type="button" onClick={openConnectModal}>
          {labels[LabelEntry.CONNECT]}
        </StyledButton>
      )}
      <MultichainConnectedButton />
    </>
  );
}
