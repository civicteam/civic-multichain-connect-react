import React from "react";
import useModal from "./useModal.js";
import { LabelEntry } from "./types.js";
import { useLabel } from "./MultichainLabelProvider.js";
import useWallet from "./useWallet.js";
import { MultichainConnectedButton } from "./MultichainConnectedButton.js";
import { Button } from "@civic/ui";

export function MultichainConnectButton(): JSX.Element | null {
  const { connected } = useWallet();
  const { openChainModal } = useModal();

  const { labels } = useLabel();
  return (
    <>
      {!connected && (
        <Button type="button" onClick={openChainModal}>
          {labels[LabelEntry.CONNECT]}
        </Button>
      )}
      <MultichainConnectedButton />
    </>
  );
}
