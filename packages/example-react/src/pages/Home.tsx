// import {
//   useChain,
//   MultichainConnectButton,
// } from "@civic/multichain-connect-react-core";
import type { FC } from "react";
import React from "react";

import { useIsConnected } from "../hooks/useIsConnected";
import {
  MultichainConnectButton,
  useChain,
} from "@civic/multichain-connect-react-core";

const Disconnected: FC = () => {
  return <>Disconnected</>;
};

const Connected: FC = () => {
  const { chains } = useChain();

  return (
    <ul>
      {chains.map((chain, index) => (
        <li key={index}>{chain.name}</li>
      ))}
    </ul>
  );
};

export const Home: FC = () => {
  const isConnected = useIsConnected();

  return (
    <div>
      <h1>dApp Example</h1>
      <MultichainConnectButton />
      {isConnected ? <Connected /> : <Disconnected />}
    </div>
  );
};
