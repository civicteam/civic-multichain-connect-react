/* eslint-disable @typescript-eslint/no-empty-function */
import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import {
  Chain,
  MultichainModalContextType,
  ChainType,
  ConnectionState,
} from "./types.js";

// Action Types as constants to avoid typos
const REGISTER_CHAINS = "REGISTER_CHAINS";
const SET_SELECTED_CHAIN = "SET_SELECTED_CHAIN";
const SET_WALLET_CONNECTION = "SET_WALLET_CONNECTION";

type WalletConnectionState = {
  [key in ChainType]?: ConnectionState;
};

type State = {
  chains: Chain[];
  selectedChain: Chain | null;
  walletConnections: WalletConnectionState;
  _forceUpdate: number;
};

type Action =
  | { type: typeof REGISTER_CHAINS; payload: Chain[] }
  | { type: typeof SET_SELECTED_CHAIN; payload: Chain | null }
  | {
      type: typeof SET_WALLET_CONNECTION;
      payload: { chainType: ChainType; state: ConnectionState };
    };

// Update the context
const MultichainModalContext = createContext<MultichainModalContextType>({
  chains: [],
  selectedChain: null,
  walletConnections: {},
  registerChains: () => {},
  setSelectedChain: () => {},
  setWalletConnection: () => {},
  getConnectionState: () => ConnectionState.Disconnected,
  _forceUpdate: 0,
});

// Update the reducer
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case REGISTER_CHAINS: {
      const newChains = action.payload.filter(
        (newChain) =>
          !state.chains.some((prevChain) => prevChain.id === newChain.id)
      );
      return {
        ...state,
        chains: [...state.chains, ...newChains],
      };
    }
    case SET_SELECTED_CHAIN:
      return {
        ...state,
        selectedChain: action.payload,
        _forceUpdate: Date.now(),
      };
    case SET_WALLET_CONNECTION:
      return {
        ...state,
        walletConnections: {
          ...state.walletConnections,
          [action.payload.chainType]: action.payload.state,
        },
        selectedChain:
          action.payload.chainType === state.selectedChain?.type &&
          action.payload.state === ConnectionState.Disconnected
            ? null
            : state.selectedChain,
      };
    default:
      return state;
  }
}

// Provider
export const MultichainProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    chains: [],
    selectedChain: null,
    walletConnections: {},
    _forceUpdate: 0,
  });

  const registerChains = useCallback((newChains: Chain[]) => {
    dispatch({ type: REGISTER_CHAINS, payload: newChains });
  }, []);

  const setSelectedChain = useCallback((chain: Chain | null) => {
    dispatch({ type: SET_SELECTED_CHAIN, payload: chain });
  }, []);

  const setWalletConnection = useCallback(
    (chainType: ChainType, connectionState: ConnectionState) => {
      dispatch({
        type: SET_WALLET_CONNECTION,
        payload: { chainType, state: connectionState },
      });
    },
    []
  );

  const getConnectionState = useCallback((): ConnectionState => {
    const connectionStates = Object.values(state.walletConnections);
    if (connectionStates.includes(ConnectionState.Connected))
      return ConnectionState.Connected;
    if (connectionStates.includes(ConnectionState.Connecting))
      return ConnectionState.Connecting;
    return ConnectionState.Disconnected;
  }, [state.walletConnections]);

  const value = useMemo(
    () => ({
      ...state,
      registerChains,
      setSelectedChain,
      setWalletConnection,
      getConnectionState,
    }),
    [
      state,
      registerChains,
      setSelectedChain,
      setWalletConnection,
      getConnectionState,
    ]
  );

  return (
    <MultichainModalContext.Provider value={value}>
      {children}
    </MultichainModalContext.Provider>
  );
};

// Hook
export const useMultichainModal = () => {
  const context = useContext(MultichainModalContext);
  if (!context) {
    throw new Error(
      "useMultichainModal must be used within a MultichainProvider"
    );
  }
  return context;
};
