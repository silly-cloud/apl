import { useVenueStore } from "../store/venueStore";
import { resolveAlert as apiResolve } from "../services/api";

export function useOpsAlerts() {
  const { state, dispatch } = useVenueStore();

  async function resolveAlert(id) {
    try {
      await apiResolve(id);
      dispatch({ type: "RESOLVE_ALERT", payload: id });
    } catch (err) {
      console.error("Resolve failed:", err.message);
    }
  }

  return { alerts: state.alerts, resolveAlert };
}
