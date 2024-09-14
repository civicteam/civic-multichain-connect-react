import React, { createContext, useState, useContext, ReactNode } from "react";
import { Chain, MultichainModalContextType } from "./types.js";

const MultichainModalContext = createContext<
  MultichainModalContextType | undefined
>(undefined);

export const MultichainModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [chains, setChains] = useState<Chain[]>([]);
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const registerChains = (newChains: Chain[]) => {
    setChains(newChains);
  };

  return (
    <MultichainModalContext.Provider
      value={{
        chains,
        registerChains,
        selectedChain,
        setSelectedChain,
        isConnected,
        setIsConnected,
      }}
    >
      {children}
    </MultichainModalContext.Provider>
  );
};

export const useMultichainModal = () => {
  const context = useContext(MultichainModalContext);
  if (context === undefined) {
    throw new Error(
      "useMultichainModal must be used within a MultichainModalProvider"
    );
  }
  return context;
};
