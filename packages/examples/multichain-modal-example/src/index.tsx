/* eslint-disable require-extensions/require-extensions */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "@civic/ui/styles.css";
import "./index.css"; // Add this line

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
