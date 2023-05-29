/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from "react";
import { ChainSelectorModalContext } from "./chainSelector/ChainSelectorProvider";
import { ModalContextType } from "./types";

const useMultichainModal = (): ModalContextType => {
  return useContext(ChainSelectorModalContext);
};

export default useMultichainModal;
