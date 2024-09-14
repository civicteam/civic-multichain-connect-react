/* eslint-disable require-extensions/require-extensions */
import React, { useEffect } from 'react';
import { MultichainModalProvider, useMultichainModal, MultichainConnectButton } from '@civic/multichain-modal';
import { ChainType } from '@civic/multichain-modal/lib/types';

const ExampleApp: React.FC = () => {
  const { registerChains, selectedChain, isConnected } = useMultichainModal();

  useEffect(() => {
    registerChains([
      { id: 'ethereum-mainnet', name: 'Ethereum', type: ChainType.Ethereum, testnet: false },
      { id: 'solana-mainnet', name: 'Solana', type: ChainType.Solana, testnet: false },
      { id: 'ethereum-goerli', name: 'Goerli', type: ChainType.Ethereum, testnet: true },
      { id: 'solana-devnet', name: 'Solana Devnet', type: ChainType.Solana, testnet: true },
    ]);
  }, [registerChains]);

  return (
    <div>
      <h1>Basic React Example</h1>
      <MultichainConnectButton />
      {isConnected && selectedChain && (
        <div>
          <h2>Connected to {selectedChain.name}</h2>
          <p>Chain ID: {selectedChain.id}</p>
          <p>Chain Type: {selectedChain.type}</p>
          <p>Testnet: {selectedChain.testnet ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <MultichainModalProvider>
      <ExampleApp />
    </MultichainModalProvider>
  );
};

export default App;
