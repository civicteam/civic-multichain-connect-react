import React, {
  PropsWithChildren,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { groupBy } from "ramda";
import { Chain, ChainSelectorContextType, SupportedChains } from "../types";
import { ChainSelectorModal } from "./ChainSelector";

export const ChainSelectorModalContext =
  React.createContext<ChainSelectorContextType>({} as ChainSelectorContextType);

export type ChainSelectorModalProps = {
  chains: Chain[];
  initialChain?: SupportedChains;
};
// Create the context provider component
export default function ChainSelectorModalProvider({
  children,
  chains,
  initialChain,
}: PropsWithChildren<ChainSelectorModalProps>): ReactElement {
  const [visible, setVisible] = useState(false);
  const [selectedChain, setSelectedChain] = useState<Chain>();
  const supportedChains = groupBy((chain: Chain) => chain.type, chains);

  console.log("ChainSelectorModalProvider chains", chains);
  const openChainSelectorModal = useCallback(() => {
    if (Object.keys(supportedChains).length === 1) {
      // The user might have canceled out of the chain selector modal
      // without selecting a chain so we need to check for that

      const selectedChain = initialChain
        ? { ...initialChain }
        : { ...chains[0] };
      console.log("openChainSelectorModal setSelectedChain", {
        chain: selectedChain,
      });
      setSelectedChain(selectedChain as Chain);
      return;
    }

    setVisible(true);
  }, [supportedChains, chains]);

  const context = useMemo(
    () => ({
      openConnectModal: openChainSelectorModal,
      chain: selectedChain,
      setSelectedChain,
      initialChain,
      chains,
    }),
    [chains, openChainSelectorModal, selectedChain, initialChain]
  );

  const onClose = useCallback(() => {
    setVisible(false);
    setSelectedChain(undefined);
  }, []);

  const onChainSelect = useCallback((chain: Chain) => {
    // The user might have canceled out of the chain selector modal
    // without selecting a chain so we need to check for that
    console.log("ChainSelectorModalProvider onChainSelect setSelectedChain", {
      chain,
    });
    setSelectedChain({ ...chain });
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
