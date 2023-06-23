import React from "react";
import styled from "styled-components";

// Styled Components
const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  background-color: white;
  padding: 30px;
  border-radius: 20px;
  min-width: 420px;
`;

const CloseButton = styled.button`
  position: absolute;
  background-color: transparent;
  border-color: transparent;
  border-width: 0px;
  top: 10px;
  right: 10px;
  cursor: pointer;
  padding: 0px;
  margin: 0px;
`;

const CloseButtonSvg = styled.svg`
  height: 20px;
  width: 20px;
  color: #a3a3a3;
`;

// Modal Component
function Modal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}): JSX.Element | null {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalWrapper>
      <ModalContent>
        {children}
        <CloseButton onClick={onClose}>
          <CloseButtonSvg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </CloseButtonSvg>
        </CloseButton>
      </ModalContent>
    </ModalWrapper>
  );
}

export default Modal;
