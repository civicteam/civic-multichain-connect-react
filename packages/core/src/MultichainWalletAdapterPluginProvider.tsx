/* eslint-disable @typescript-eslint/no-explicit-any */
// pluginRegistry.js
import React, { ReactElement, createContext, useMemo, useState } from "react";
import {
  SupportedChains,
  WalletAdapterContextType,
  WalletAdpaterPlugin,
} from "./types";

export const MultichainWalletAdapterPluginContext = createContext<
  WalletAdapterContextType<any, any, any>
>({} as WalletAdapterContextType<any, any, any>);

export default function MultichainWalletAdapterPluginProvider<S, E>({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  const [adapers, setAdapters] = useState<
    Record<string, WalletAdpaterPlugin<SupportedChains, S, E>>
  >({});

  const setWalletAdapter = (
    name: string,
    adapter: WalletAdpaterPlugin<SupportedChains, S, E>
  ) => {
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
