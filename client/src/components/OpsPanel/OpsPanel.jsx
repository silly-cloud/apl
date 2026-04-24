import { useVenueStore }  from "../../store/venueStore";
import { useOpsAlerts }   from "../../hooks/useOpsAlerts";
import VenueMinimap from "./VenueMinimap";
import ZoneCard     from "./ZoneCard";
import AlertCard    from "./AlertCard";
import SurgeButton  from "./SurgeButton";

export default function OpsPanel() {
  const { state }                = useVenueStore();
  const { alerts, resolveAlert } = useOpsAlerts();

  const zones = state.venueState?.zones || [];
  const ts    = state.venueState?.updatedAt
    ? new Date(state.venueState.updatedAt).toLocaleTimeString([], {
        hour:   "2-digit",
        minute: "2-digit",
        second: "2-digit"
      })
    : "—";

  return (
    <div className="panel panel-right">
      <div className="panel-header">
        <h2>Live ops</h2>
        <p>Updated {ts}</p>
      </div>

      <div className="ops-scroll">
        <VenueMinimap />

        <div>
          <p className="section-label">Zone status</p>
          <div className="zone-grid">
            {zones.map(z => <ZoneCard key={z.id} zone={z} />)}
          </div>
        </div>

        <div className="alerts-section">
          <h3>Active alerts ({alerts.length})</h3>
          {alerts.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>No active alerts</p>
          ) : (
            alerts.map(a => <AlertCard key={a._id} alert={a} onResolve={resolveAlert} />)
          )}
        </div>

        <SurgeButton />
      </div>
    </div>
  );
}
