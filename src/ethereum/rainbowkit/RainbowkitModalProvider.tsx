import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { ReactElement, useEffect, useMemo } from "react";
import { ChainType, ModalContextType } from "../../types";
import useChain from "../../useChain";

export const RainbowkitModalContext = React.createContext<ModalContextType>(
  {} as ModalContextType
);

// Create the context provider component
export default function RainbowkitModalProvider({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  const { openConnectModal } = useConnectModal();
  const { chain } = useChain();

  const context = useMemo(
    () => ({
      openConnectModal,
    }),
    [openConnectModal]
  );

  useEffect(() => {
    if (chain?.type === ChainType.Ethereum) {
      openConnectModal?.();
    }
  }, [chain, openConnectModal]);

  return (
    <RainbowkitModalContext.Provider value={context}>
      {children}
    </RainbowkitModalContext.Provider>
  );
}
