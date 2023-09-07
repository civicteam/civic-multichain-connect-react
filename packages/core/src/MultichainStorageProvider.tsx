/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { StorageContextType } from "./types.js";

export const LocalStorageContext = React.createContext<StorageContextType<any>>(
  {} as StorageContextType<any>
);

export function LocalStorageProvider<T>({
  children,
}: {
  children: React.ReactNode;
}) {
  const get = (key: string): T | undefined => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      return JSON.parse(storedValue) as T;
    }
    return undefined;
  };

  const set = (key: string, item: T): void => {
    localStorage.setItem(key, JSON.stringify(item));
  };

  const clear = (key: string): void => {
    const item = get(key);
    if (item) {
      localStorage.removeItem(key);
    }
  };

  const context = useMemo(
    () => ({
      get,
      set,
      clear,
    }),
    [get, set, clear]
  );

  return (
    <LocalStorageContext.Provider value={context}>
      {children}
    </LocalStorageContext.Provider>
  );
}
