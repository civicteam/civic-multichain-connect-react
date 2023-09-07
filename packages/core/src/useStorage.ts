import { useContext } from "react";
import { LocalStorageContext } from "./MultichainStorageProvider.js";
import { StorageContextType } from "./types.js";

export const useLocalStorage = <T>(): StorageContextType<T> => {
  const context = useContext(LocalStorageContext);
  if (!context) {
    throw new Error(
      "useLocalStorage must be used within a LocalStorageProvider"
    );
  }
  return context;
};
