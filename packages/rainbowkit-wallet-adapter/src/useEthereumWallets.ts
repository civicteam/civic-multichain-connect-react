// This file is copied with modifications from:
// - https://github.com/rainbow-me/rainbowkit/blob/0d5640929326d65673596a11cd018a9c6524ff8c/packages/rainbowkit/src/wallets/getDefaultWallets.ts.
// - https://github.com/wallet-standard/wallet-standard/blob/8ac98a8ac6001a34906d01eac2ae0825f7208b32/packages/react/core/src/WalletsProvider.tsx.
import { useEffect, useMemo, useState } from "react";
import {
  Chain,
  Wallet,
  WalletList,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  braveWallet,
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { getWallets } from "@wallet-standard/app";
import type { Wallet as StandardWallet } from "@wallet-standard/base";
import { standardEthereumWallet } from "./ethereumStandardWallet.js";

function useNonStandardWallets({
  appName,
  walletConnectProjectId,
  chains,
}: {
  appName: string;
  walletConnectProjectId: string;
  chains: Chain[];
}): Wallet[] {
  return [
    injectedWallet({ chains }),
    safeWallet({ chains }),
    rainbowWallet({ chains, projectId: walletConnectProjectId }),
    coinbaseWallet({ appName, chains }),
    metaMaskWallet({ chains, projectId: walletConnectProjectId }),
    walletConnectWallet({ chains, projectId: walletConnectProjectId }),
    braveWallet({ chains }),
  ];
}

function isWagmiCompatibleWallet(wallet: StandardWallet) {
  return "ethereum:provider" in wallet.features;
}

function useStandardWallets({
  chains,
}: {
  chains: Chain[];
}): (Wallet & StandardWallet)[] {
  const { get, on } = useMemo(() => getWallets(), []);

  const [wallets, setWallets] = useState(() => get());

  useEffect(() => {
    const destructors: (() => void)[] = [];

    // FIXME: This can definitely happen, refactor similar to @solana/wallet-standard-wallet-adapter-react.
    // Get and set the wallets that have been registered already, in case they changed since the state initializer.
    setWallets(get());

    destructors.push(on("register", () => setWallets(get())));
    destructors.push(on("unregister", () => setWallets(get())));

    return () => {
      destructors.forEach((destroy) => destroy());
    };
  }, [get, on]);

  return wallets
    .filter(isWagmiCompatibleWallet)
    .map((wallet) => standardEthereumWallet({ chains, wallet }));
}

function useEthereumWallets({
  appName,
  walletConnectProjectId,
  chains,
}: {
  appName: string;
  walletConnectProjectId: string;
  chains: Chain[];
}): {
  connectors: [] | ReturnType<typeof connectorsForWallets>;
  wallets: Wallet[];
} {
  const nonStandardWallets = useNonStandardWallets({
    appName,
    walletConnectProjectId,
    chains,
  });
  const standardWallets = useStandardWallets({ chains });

  // Wait for the `standardWallets` to be defined to pass all connectors to `createClient` just once.
  if (!standardWallets.length) {
    return {
      connectors: [],
      wallets: [],
    };
  }

  const wallets: WalletList = [
    {
      groupName: "Popular",
      wallets: [...nonStandardWallets],
    },
  ];

  return {
    connectors: connectorsForWallets(wallets),
    wallets: [...nonStandardWallets, ...standardWallets],
  };
}

export default useEthereumWallets;
