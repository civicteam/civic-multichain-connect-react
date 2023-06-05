// pluginRegistry.js
import React, { ReactElement, createContext, useMemo, useState } from "react";
import { WalletAdapterContextType, WalletAdpaterPlugin } from "./types";

export const MultichainWalletAdapterPluginContext =
  createContext<WalletAdapterContextType>({} as WalletAdapterContextType);

export default function MultichainWalletAdapterPluginProvider({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  const [adapers, setAdapters] = useState<Record<string, WalletAdpaterPlugin>>(
    {}
  );

  const setWalletAdapter = (name: string, adapter: WalletAdpaterPlugin) => {
    setAdapters((prevAdapters) => ({
      ...prevAdapters,
      [name]: adapter,
    }));
  };

  const getWalletAdapter = (name: string) => {
    return adapers[name];
  };

  const getWalletAdapters = () => Object.values(adapers);

  const context = useMemo(
    () => ({
      setWalletAdapter,
      getWalletAdapter,
      getWalletAdapters,
    }),
    [setWalletAdapter, getWalletAdapter, getWalletAdapters]
  );

  return (
    <MultichainWalletAdapterPluginContext.Provider value={context}>
      {children}
    </MultichainWalletAdapterPluginContext.Provider>
  );
}
