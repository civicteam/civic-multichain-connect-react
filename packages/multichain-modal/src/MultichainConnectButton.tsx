import React, { useState } from "react";
import { Button } from "@civic/ui";
import { useMultichainModal } from "./MultichainModalContext.js";
import { MultichainModal } from "./MultichainModal.js";

export const MultichainConnectButton: React.FC = () => {
  const { connectionState } = useMultichainModal();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      {connectionState === "disconnected" && (
        <Button onClick={handleOpenModal}>Connect Wallet</Button>
      )}
      <MultichainModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </>
  );
};
