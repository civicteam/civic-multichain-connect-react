/* eslint-disable @typescript-eslint/no-empty-function */
import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { Chain, MultichainModalContextType } from "./types.js";

// Action Types as constants to avoid typos
const REGISTER_CHAINS = "REGISTER_CHAINS";
const SET_SELECTED_CHAIN = "SET_SELECTED_CHAIN";
const SET_CONNECTION_STATE = "SET_CONNECTION_STATE";

type State = {
  chains: Chain[];
  selectedChain: Chain | null;
  connectionState: "connected" | "connecting" | "disconnected";
  _forceUpdate: number;
};

type Action =
  | { type: typeof REGISTER_CHAINS; payload: Chain[] }
  | { type: typeof SET_SELECTED_CHAIN; payload: Chain | null }
  | { type: typeof SET_CONNECTION_STATE; payload: State["connectionState"] };

// Context with a default value to avoid undefined checks
const MultichainModalContext = createContext<MultichainModalContextType>({
  chains: [],
  selectedChain: null,
  connectionState: "disconnected",
  registerChains: () => {},
  setSelectedChain: () => {},
  setConnectionState: () => {},
  _forceUpdate: 0,
});

// Reducer
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
    case SET_CONNECTION_STATE:
      return {
        ...state,
        connectionState: action.payload,
        selectedChain:
          action.payload === "disconnected" && state.selectedChain
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
    connectionState: "disconnected",
    _forceUpdate: 0,
  });

  const registerChains = useCallback((newChains: Chain[]) => {
    dispatch({ type: REGISTER_CHAINS, payload: newChains });
  }, []);

  const setSelectedChain = useCallback((chain: Chain | null) => {
    dispatch({ type: SET_SELECTED_CHAIN, payload: chain });
  }, []);

  const setConnectionState = useCallback(
    (newState: State["connectionState"]) => {
      dispatch({ type: SET_CONNECTION_STATE, payload: newState });
    },
    []
  );

  const value = useMemo(
    () => ({
      ...state,
      registerChains,
      setSelectedChain,
      setConnectionState,
    }),
    [state, registerChains, setSelectedChain, setConnectionState]
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
