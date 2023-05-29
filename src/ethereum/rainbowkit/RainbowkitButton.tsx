/* eslint-disable import/no-extraneous-dependencies */
import { ConnectButton as DefaultConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";

export function RainbowkitButton(): JSX.Element {
  return (
    <DefaultConnectButton.Custom>
      {({ account, chain, authenticationStatus, mounted }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        if (!connected) {
          return null;
        }

        return <DefaultConnectButton />;
      }}
    </DefaultConnectButton.Custom>
  );
}
