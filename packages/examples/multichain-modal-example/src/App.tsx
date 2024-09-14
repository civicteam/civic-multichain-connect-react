import React from "react";
import {
  MultichainConnectButton,
  MultichainModalProvider,
} from "@civic/multichain-modal";

function App() {
  return (
    <MultichainModalProvider>
      <div className="App min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          Multichain Modal Example
        </h1>
        <MultichainConnectButton />
      </div>
    </MultichainModalProvider>
  );
}

export default App;
