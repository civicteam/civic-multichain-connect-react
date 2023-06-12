/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from "react";
import { ChainSelectorModalContext } from "./MultichainSelectorProvider.js";
import { BaseChain, ChainContextType, SupportedChains } from "./types.js";

const useChain = <
  T extends SupportedChains,
  S extends BaseChain,
  E extends BaseChain
>(): ChainContextType<T, S, E> => {
  return useContext(ChainSelectorModalContext);
};

export default useChain;
