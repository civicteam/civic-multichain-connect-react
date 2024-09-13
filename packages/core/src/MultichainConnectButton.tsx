import React from "react";
import useModal from "./useModal.js";
import { LabelEntry } from "./types.js";
import { useLabel } from "./MultichainLabelProvider.js";
import useWallet from "./useWallet.js";
import { MultichainConnectedButton } from "./MultichainConnectedButton.js";
import { Button } from "@civic/ui";

export function MultichainConnectButton(): JSX.Element {
  const { connected, connecting } = useWallet();
  const { openChainModal } = useModal();
  const { labels } = useLabel();

  if (connected) {
    return <MultichainConnectedButton />;
  }

  return (
    <Button type="button" onClick={openChainModal} disabled={connecting}>
      {connecting ? labels[LabelEntry.CONNECTING] : labels[LabelEntry.CONNECT]}
    </Button>
  );
}
