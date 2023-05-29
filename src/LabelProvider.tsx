import React, { ReactElement, useContext, useMemo } from "react";
import { defaultLabels } from "./constants";
import { LabelContextType, Labels } from "./types";

export const LabelContext = React.createContext<LabelContextType>(
  {} as LabelContextType
);

export default function LabelProvider({
  children,
  labels = defaultLabels,
}: {
  children: React.ReactNode;
  labels: Labels | undefined;
}): React.ReactElement {
  const context = useMemo(
    () => ({
      labels,
    }),
    [labels]
  );

  return (
    <LabelContext.Provider value={context}>{children}</LabelContext.Provider>
  );
}

LabelProvider.defaultProps = {
  labels: defaultLabels
}
export const useLabel = (): LabelContextType => {
  return useContext(LabelContext);
};
