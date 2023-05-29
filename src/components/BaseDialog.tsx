import { Dialog, Transition } from "@headlessui/react";
import React, { CSSProperties, Fragment, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const defaultOnClose = () => ({});

// Define your styled components
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 101;
  background: rgba(75, 85, 99, 0.6);
`;


const DialogTitle = styled.h2`
  /* Add styles for title here */
`;

const DialogPanel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow-y: auto;
  overflow-x: hidden;
`;interface ContentProps {
  withPadding: boolean;
}

const Content = styled.div<ContentProps>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  border: 0;
  background-color: white;
  box-shadow: rgba(19, 21, 30, 0.65);
  outline: none;
  padding: ${({ withPadding }) => (withPadding ? "16px" : "0")};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  display: inline-flex;
  background-color: transparent;
  cursor: pointer;
  border-radius: 9999px;
  padding: 1.5px;
  color: gray;
  outline: none;
  &:hover {
    background-color: gray;
    color: white;
  }
`;

// BaseDialog component
export default function BaseDialog({
  isOpen,
  onClose,
  title,
  withPadding = true,
  children,
  withOverlay = true,
}: {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  contentClassName?: string;
  withPadding?: boolean;
  children: React.ReactChild;
  withOverlay?: boolean;
}): React.ReactElement | null {
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    setShowDialog(isOpen);
  }, [isOpen]);

  if (!showDialog) return null;

  if (!isOpen) return null;

  return (
    <>
      {withOverlay && <Overlay />}
      <DialogPanel>
        <Content withPadding={withPadding}>
          {title && <DialogTitle>{title}</DialogTitle>}
          {onClose && (
            <CloseButton onClick={onClose}>
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </CloseButton>
          )}
          <div>{children}</div>
        </Content>
      </DialogPanel>
    </>
  );
}

BaseDialog.defaultProps = {
  contentClassName: "",
  title: undefined,
  withPadding: true,
  withOverlay: true,
  onClose: defaultOnClose,
};
