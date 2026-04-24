import { useEffect } from "react";
import { useVenueStore } from "../store/venueStore";

export function useVenueState() {
  const { dispatch } = useVenueStore();

  useEffect(() => {
    const es = new EventSource("/api/venue/events");

    es.addEventListener("venueUpdate", e => {
      dispatch({ type: "SET_VENUE_STATE", payload: JSON.parse(e.data) });
    });

    es.addEventListener("opsAlerts", e => {
      dispatch({ type: "SET_ALERTS", payload: JSON.parse(e.data) });
    });

    es.onopen  = () => dispatch({ type: "SET_CONNECTED", payload: true });
    es.onerror = () => dispatch({ type: "SET_CONNECTED", payload: false });

    return () => es.close();
  }, [dispatch]);
}
