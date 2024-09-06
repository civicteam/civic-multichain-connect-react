import React from "react";
import useModal from "./useModal.js";
import { LabelEntry } from "./types.js";
import { useLabel } from "./MultichainLabelProvider.js";
import useWallet from "./useWallet.js";
import { MultichainConnectedButton } from "./MultichainConnectedButton.js";
import { Button } from "@civic/ui";

export function MultichainConnectButton(): JSX.Element | null {
  const { connected, connecting } = useWallet();
  const { openChainModal } = useModal();
  const { labels } = useLabel();

  if (connecting) {
    return null;
  }

  return connected ? (
    <MultichainConnectedButton />
  ) : (
    <Button type="button" onClick={openChainModal}>
      {labels[LabelEntry.CONNECT]}
    </Button>
  );
}
