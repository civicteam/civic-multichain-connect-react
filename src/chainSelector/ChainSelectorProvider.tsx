import React, {
  PropsWithChildren,
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Chain, ChainSelectorContextType, ModalContextType } from "../types";
import { ChainSelectorModal } from "./ChainSelector";

type ChainSelectorModalContextType = ModalContextType &
  ChainSelectorContextType;

export const ChainSelectorModalContext =
  React.createContext<ChainSelectorModalContextType>(
    {} as ChainSelectorModalContextType
  );

export type ChainSelectorModalProps = {
  chains: Chain[];
};
// Create the context provider component
export default function ChainSelectorModalProvider({
  children,
  chains,
}: PropsWithChildren<ChainSelectorModalProps>): ReactElement {
  const [visible, setVisible] = useState(false);
  const [selectedChain, setSelectedChain] = useState<Chain>();

  const openChainSelectorModal = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const context = useMemo(
    () => ({
      openConnectModal: openChainSelectorModal,
      chain: selectedChain,
      setSelectedChain,
    }),
    [openChainSelectorModal, selectedChain]
  );

  const onClose = useCallback(() => {
    setVisible(false);
    setSelectedChain(undefined);
  }, []);

  const onChainSelect = useCallback((chain: Chain) => {
    setSelectedChain(chain);
    setVisible(false);
  }, []);

  return (
    <ChainSelectorModalContext.Provider value={context}>
      <ChainSelectorModal
        chains={chains}
        isOpen={visible}
        onClose={onClose}
        onChainSelect={onChainSelect}
      />
      {children}
    </ChainSelectorModalContext.Provider>
  );
}
