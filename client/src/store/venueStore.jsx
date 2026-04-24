import { createContext, useContext, useReducer } from "react";

const VenueContext = createContext(null);

const initialState = {
  venueState:  null,
  alerts:      [],
  isConnected: false,
  apiKey:      null,   // sk-ant-... stored in memory only, never persisted
  keyMeta:     null    // { name, partial_key_hint, workspace_id }
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_VENUE_STATE": return { ...state, venueState: action.payload };
    case "SET_ALERTS":      return { ...state, alerts: action.payload };
    case "SET_CONNECTED":   return { ...state, isConnected: action.payload };
    case "SET_API_KEY":     return { ...state, apiKey: action.payload.key, keyMeta: action.payload.meta };
    case "CLEAR_API_KEY":   return { ...state, apiKey: null, keyMeta: null };
    case "RESOLVE_ALERT":   return { ...state, alerts: state.alerts.filter(a => a._id !== action.payload) };
    default: return state;
  }
}

export function VenueProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <VenueContext.Provider value={{ state, dispatch }}>
      {children}
    </VenueContext.Provider>
  );
}

export function useVenueStore() {
  return useContext(VenueContext);
}
