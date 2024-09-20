import React, { ButtonHTMLAttributes, useState } from "react";
import { Button } from "@civic/ui";
import { useMultichainModal } from "./MultichainModalContext.js";
import { MultichainModal } from "./MultichainModal.js";
import { ConnectionState } from "./types.js";

export const MultichainConnectButton: React.FC<
  ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => {
  const { getConnectionState } = useMultichainModal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const connectionState = getConnectionState();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      {connectionState !== ConnectionState.Connected && (
        <Button onClick={handleOpenModal} {...props}>
          {connectionState === ConnectionState.Connecting
            ? "Connecting..."
            : "Connect Wallet"}
        </Button>
      )}
      <MultichainModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </>
  );
};
