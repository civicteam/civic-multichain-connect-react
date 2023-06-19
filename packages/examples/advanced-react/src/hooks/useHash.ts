import React from "react";

export const useHash = (): {
  hash: string;
  updateHash: (newHash: string) => void;
} => {
  const [hash, setHash] = React.useState(() =>
    window.location.hash.replace("#", "")
  );

  const hashChangeHandler = React.useCallback(() => {
    setHash(window.location.hash.replace("#", ""));
  }, [window.location.hash]);

  React.useEffect(() => {
    window.addEventListener("hashchange", hashChangeHandler);
    return () => {
      window.removeEventListener("hashchange", hashChangeHandler);
    };
  }, []);

  const updateHash = React.useCallback(
    (newHash: string) => {
      if (newHash !== hash) {
        window.location.hash = newHash;
      }
    },
    [hash]
  );

  return { hash, updateHash };
};
