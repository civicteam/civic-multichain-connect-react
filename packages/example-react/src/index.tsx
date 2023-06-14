import type { FC } from "react";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MultichainWalletProvider } from "@civic/multichain-connect-react-core";
import { App } from "./App";

const Root: FC = () => {
  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
};

const rootNode = document.getElementById("root");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(rootNode!);
root.render(<Root />);
