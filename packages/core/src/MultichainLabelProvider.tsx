import React, { ReactElement, useContext, useMemo } from "react";
import { defaultLabels } from "./constants.js";
import { LabelContextType, Labels } from "./types.js";

export const LabelContext = React.createContext<LabelContextType>(
  {} as LabelContextType
);

export default function LabelProvider({
  children,
  labels,
}: {
  children: React.ReactNode;
  labels: Labels | undefined;
}): ReactElement {
  console.log("LabelProvider labels", { labels, defaultLabels });
  const context = useMemo(
    () => ({
      labels: labels || defaultLabels,
    }),
    [labels]
  );

  return (
    <LabelContext.Provider value={context}>{children}</LabelContext.Provider>
  );
}

export const useLabel = (): LabelContextType => {
  return useContext(LabelContext);
};
