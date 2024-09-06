import { ConnectButton as DefaultConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import { useRainbowkitOptions } from "./RainbowitOptionsProvider.js";
import { useWallet } from "@civic/multichain-connect-react-core";

export function RainbowkitButton(): JSX.Element {
  const { options } = useRainbowkitOptions();
  return (
    <DefaultConnectButton.Custom>
      {({ chain, openConnectModal, openChainModal }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const { connected, connecting } = useWallet();

        if (!connected || connecting) {
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

              if (chain?.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }

              return (
                <DefaultConnectButton
                  accountStatus={options.accountStatus}
                  showBalance={!!options.showBalance}
                  chainStatus={options.chainStatus}
                  label={options.label}
                />
              );
            })()}
          </div>
        );
      }}
    </DefaultConnectButton.Custom>
  );
}
