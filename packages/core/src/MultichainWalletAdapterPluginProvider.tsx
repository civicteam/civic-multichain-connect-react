/* eslint-disable @typescript-eslint/no-explicit-any */
// pluginRegistry.js
import React, {
  ReactElement,
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  SupportedChains,
  WalletAdapterContextType,
  WalletAdpaterPlugin,
} from "./types.js";

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

  const setWalletAdapter = useCallback(
    (name: string, adapter: WalletAdpaterPlugin<SupportedChains, S, E>) => {
      setAdapters((prevAdapters) => ({
        ...prevAdapters,
        [name]: adapter,
      }));
    },
    []
  );

  const getWalletAdapter = useCallback(
    (name: string) => {
      return adapers[name];
    },
    [adapers]
  );

  const getWalletAdapters = useCallback(
    () => Object.values(adapers),
    [adapers]
  );

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
