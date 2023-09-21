import { ConnectButton as DefaultConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import { useRainbowkitOptions } from "./RainbowitOptionsProvider.js";

export function RainbowkitButton(): JSX.Element {
  const { options } = useRainbowkitOptions();
  return (
    <DefaultConnectButton.Custom>
      {({
        account,
        chain,
        authenticationStatus,
        mounted,
        openConnectModal,
        openChainModal,
      }) => {
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

        // TODO: Define these as props
        return (
          <div>
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button">
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }

              return (
                <DefaultConnectButton
                  accountStatus="address"
                  showBalance={!!options.showBalance}
                />
              );
            })()}
          </div>
        );
      }}
    </DefaultConnectButton.Custom>
  );
}
