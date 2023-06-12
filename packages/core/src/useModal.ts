/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from "react";
import { ChainSelectorModalContext } from "./MultichainSelectorProvider.js";
import { SupportedChains, ChainContextType, BaseChain } from "./types.js";

const useMultichainModal = <
  T extends SupportedChains,
  S extends BaseChain,
  E extends BaseChain
>(): ChainContextType<T, S, E> => {
  return useContext(ChainSelectorModalContext);
};

export default useMultichainModal;
