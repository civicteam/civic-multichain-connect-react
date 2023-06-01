
import { ConnectButton as DefaultConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  display: inline-block;
  border-radius: 25px;
  padding: 0.5rem;
  width: 3rem;
  border: 2px solid black;
  background: white;
  color: black;
`;

export function RainbowkitButton(): JSX.Element {
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
                <div style={{ display: "flex", gap: 12 }}>
                  <StyledButton type="button" onClick={openChainModal}>
                    <img src={chain.iconUrl} alt="" />
                  </StyledButton>

                  <DefaultConnectButton showBalance={false} />
                </div>
              );
            })()}
          </div>
        );
      }}
    </DefaultConnectButton.Custom>
  );
}
