import React, { ReactElement, useMemo } from "react";
import { RainbowkitConfigOptions } from "./types.js";

export type OptionsContextType = {
  options: RainbowkitConfigOptions;
};

export const RainbowkitOptionsContext = React.createContext<OptionsContextType>(
  {
    options: {
      appName: "",
      walletConnectProjectId: "",
    },
  }
);
export default function RainbowkitOptionsProvider({
  children,
  options,
}: {
  children: React.ReactNode;
  options: RainbowkitConfigOptions;
}): ReactElement {
  const context = useMemo(() => ({ options }), [options]);
  return (
    <RainbowkitOptionsContext.Provider value={context}>
      {children}
    </RainbowkitOptionsContext.Provider>
  );
}

export const useRainbowkitOptions = (): OptionsContextType =>
  React.useContext(RainbowkitOptionsContext);
