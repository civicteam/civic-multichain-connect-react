/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from "react";
import { ChainSelectorModalContext } from "./chainSelector/ChainSelectorProvider";
import { ChainSelectorContextType } from "./types";

const useMultichainModal = (): ChainSelectorContextType => {
  return useContext(ChainSelectorModalContext);
};

export default useMultichainModal;
