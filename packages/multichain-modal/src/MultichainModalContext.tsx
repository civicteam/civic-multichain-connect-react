import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
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
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(false);

  const registerChains = useCallback((newChains: Chain[]) => {
    setChains((prevChains) => {
      const uniqueNewChains = newChains.filter(
        (newChain) =>
          !prevChains.some((prevChain) => prevChain.id === newChain.id)
      );
      return [...prevChains, ...uniqueNewChains];
    });
  }, []);

  return (
    <MultichainModalContext.Provider
      value={{
        chains,
        registerChains,
        selectedChain,
        setSelectedChain,
        isConnected,
        setIsConnected,
        isConnecting,
        setIsConnecting,
        isDisconnected,
        setIsDisconnected,
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
