# Multichain Modal Library

This library provides a simple way to integrate multichain wallet connections in your React application, supporting both Ethereum (via Rainbow Kit) and Solana wallets.

## Project Structure

This project is a monorepo managed with pnpm, containing the following packages:

- `@civic/multichain-modal`: The core multichain modal component library
- `@civic/multichain-modal-rainbowkit`: RainbowKit integration for Ethereum wallets
- `@civic/multichain-modal-solana`: Solana wallet integration

## Installation

Install the necessary packages:

```bash
npm install @civic/multichain-modal @civic/multichain-modal-rainbowkit @civic/multichain-modal-solana @rainbow-me/rainbowkit wagmi viem @solana/wallet-adapter-react @solana/wallet-adapter-react-ui
```

## Usage

### 1. Import required components and hooks

```typescript
import {
  ChainType,
  MultichainConnectButton,
  useMultichainModal,
  MultichainProvider,
} from "@civic/multichain-modal";
import {
  useAccount,
  WagmiProvider,
  QueryClient,
  QueryClientProvider,
  MultichainRainbowKitProvider,
  RainbowKitConnectedButton,
} from "@civic/multichain-modal-rainbowkit";
import {
  MultichainSolanaProvider,
  SolanaChain,
  SolanaWalletConnectedButton,
} from "@civic/multichain-modal-solana";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia, Chain } from "wagmi/chains";
import { useWallet } from "@solana/wallet-adapter-react";
```

### 2. Define your chains

```typescript
const ethereumChains: Chain[] = [
  { ...mainnet, iconUrl: "/ethereum.svg" },
  { ...sepolia, iconUrl: "/ethereum.svg" },
];

const solanaChains: SolanaChain[] = [
  {
    id: hashString('solana-mainnet') // need to be a unique id,
    name: "Solana",
    rpcEndpoint: "https://api.mainnet-beta.solana.com",
    type: ChainType.Solana,
    testnet: false,
    iconUrl: "/solana.svg",
  },
  {
    id: hashString('solana-devnet') // need to be a unique id,
    name: "Solana Devnet",
    rpcEndpoint: "https://api.devnet.solana.com",
    type: ChainType.Solana,
    testnet: true,
    iconUrl: "/solana.svg",
  },
];
```

### 3. Configure Wagmi

```typescript
const wagmiConfig = getDefaultConfig({
  appName: "Your App Name",
  projectId: "YOUR_WALLET_CONNECT_PROJECT_ID",
  chains: ethereumChains,
});

const queryClient = new QueryClient();
```

### 4. Set up your app structure

```tsx
function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <MultichainProvider>
          <MultichainRainbowKitProvider
            modalSize="compact"
            chains={ethereumChains}
          >
            <MultichainSolanaProvider wallets={[]} chains={solanaChains}>
              <YourAppComponent />
            </MultichainSolanaProvider>
          </MultichainRainbowKitProvider>
        </MultichainProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### 5. Implement your main component

```tsx
function YourAppComponent() {
  const { selectedChain, getConnectionState } = useMultichainModal();
  const ethereumWallet = useAccount();
  const solanaWallet = useWallet();
  const connectionState = getConnectionState();

  return (
    <div>
      <MultichainConnectButton />
      <RainbowKitConnectedButton />
      <SolanaWalletConnectedButton />
      {connectionState === "connected" && selectedChain && (
        <div>
          <h2>Connected to {selectedChain.name}</h2>
          <p>Chain ID: {selectedChain.id}</p>
          <p>Chain Type: {selectedChain.type}</p>
          <p>Testnet: {selectedChain.testnet ? "Yes" : "No"}</p>
          <p>
            Address:{" "}
            {ethereumWallet.address || solanaWallet?.publicKey?.toString()}
          </p>
        </div>
      )}
    </div>
  );
}
```

This setup provides a basic integration of the multichain modal library in your React application. You can customize the appearance and behavior of the components as needed.

Remember to replace `"YOUR_WALLET_CONNECT_PROJECT_ID"` with your actual Wallet Connect project ID.

## Development

### Prerequisites

- Node.js >= 16
- pnpm >= 7

### Setting up the development environment

1. Clone the repository:
   ```bash
   git clone git@github.com:civicteam/civic-multichain-connect-react.git
   cd civic-multichain-connect-react
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Build all packages:
   ```bash
   pnpm run build:all
   ```

### Running the project

To run the project in development mode, you'll need to start each package individually. Navigate to each package directory and run:

```bash
pnpm run dev
```

### Scripts

- `pnpm run nuke`: Remove all node_modules and lock files
- `pnpm run reinstall`: Nuke and reinstall all dependencies
- `pnpm run clean`: Clean all build artifacts
- `pnpm run build:all`: Build all packages
- `pnpm run build:clean`: Clean and rebuild all packages
- `pnpm run publish:beta`: Publish a beta version of all packages
- `pnpm run publish:release`: Publish a release version of all packages

## Contributing

We welcome contributions to the Multichain Modal Library! Here's how you can contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please make sure to update tests as appropriate and adhere to the existing coding style.

### Code Style

We use ESLint and Prettier to maintain code quality and consistency. Before submitting a pull request, please run:

```bash
pnpm run lint
```

And fix any issues that are reported.

## Quick Start for Developers

To quickly get started with development and see how the library works:

1. Clone the repository:
   ```bash
   git clone git@github.com:civicteam/civic-multichain-connect-react.git
   cd civic-multichain-connect-react
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the example project:
   ```bash
   cd packages/multichain-modal-example
   pnpm run start
   ```

This will start the development server, and you should be able to see the example application running in your browser.

### Making Changes

To make changes to the library and see them reflected in the example:

1. Make your changes in the relevant package (e.g., `packages/multichain-modal`).

2. Rebuild the changed package:
   ```bash
   cd packages/multichain-modal
   pnpm run build
   ```

3. If the example server is already running, you may need to stop it (Ctrl+C) and start it again to see your changes:
   ```bash
   cd ../multichain-modal-example
   pnpm run start
   ```

Note: Depending on the changes you've made, you might need to restart the development server to see the updates.

## License

This project is licensed under the MIT License.

## Contact

Civic.com - [@civickey](https://twitter.com/civickey)

Project Link: [https://github.com/civicteam/civic-multichain-connect-react](https://github.com/civicteam/civic-multichain-connect-react)