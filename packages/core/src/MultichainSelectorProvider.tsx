/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactElement, useCallback, useMemo, useState } from "react";
import { groupBy } from "ramda";
import {
  BaseChain,
  Chain,
  ChainContextType,
  SupportedChains,
} from "./types.js";
import { ChainSelectorModal } from "./components/ChainSelector.js";

export const ChainSelectorModalContext = React.createContext<
  ChainContextType<any, any, any>
>({} as ChainContextType<any, any, any>);

// Create the context provider component
export default function ChainSelectorModalProvider<
  T extends SupportedChains,
  S extends BaseChain,
  E extends BaseChain
>({ children }: { children: React.ReactNode }): ReactElement {
  const [visible, setVisible] = useState(false);
  const [selectedChain, setSelectedChain] = useState<Chain<T, S, E>>();
  const [chains, setChains] = useState<Chain<T, S, E>[]>([]);

  const openChainModal = useCallback(() => {
    // Group the chains by chain type
    const groupedChains: Record<string, Array<any>> = chains.length
      ? groupBy((c) => c.type, chains)
      : {};

    // If there is only one chain type and only one chain of that type, we can set it as the selected chain
    if (Object.keys(groupedChains).length === 1) {
      // If there's only one key, check the length of its array
      const key = Object.keys(groupedChains)[0];
      if (groupedChains[key].length === 1) {
        // The user might have canceled out of the chain selector modal
        // without selecting a chain so we need to check for that
        setSelectedChain(
          selectedChain ? { ...selectedChain } : { ...chains[0] }
        );
        return;
      }
    }

    setVisible(true);
  }, [chains, selectedChain]);

  // Replace all chains of the same type with the new set of chains
  const setChainsByType = useCallback(
    (newChains: Chain<T, S, E>[], type: SupportedChains) => {
      setChains((prevChains) => {
        const existingChains = prevChains.filter((chain) => {
          return chain.type !== type;
        });
        return [...existingChains, ...newChains];
      });
    },
    [setChains, chains]
  );

  const context = useMemo(
    () => ({
      openChainModal,
      selectedChain,
      setSelectedChain,
      chains,
      setChains: setChainsByType,
    }),
    [chains, openChainModal, selectedChain, setChains, setSelectedChain]
  );

  const onClose = useCallback(() => {
    setVisible(false);
    setSelectedChain(undefined);
  }, []);

  const onChainSelect = useCallback((chain: Chain<T, S, E>) => {
    // The user might have canceled out of the chain selector modal
    // without selecting a chain so we need to check for that
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
