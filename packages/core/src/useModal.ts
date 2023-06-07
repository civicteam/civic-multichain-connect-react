/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from "react";
import { ChainSelectorModalContext } from "./MultichainSelectorProvider";
import { SupportedChains, ChainContextType, BaseChain } from "./types";

const useMultichainModal = <
  T extends SupportedChains,
  S extends BaseChain,
  E extends BaseChain
>(): ChainContextType<T, S, E> => {
  return useContext(ChainSelectorModalContext);
};

export default useMultichainModal;
