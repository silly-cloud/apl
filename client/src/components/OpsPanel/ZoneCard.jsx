import StatusBadge from "../shared/StatusBadge";

export default function ZoneCard({ zone }) {
  const pct = Math.round((zone.queue / zone.capacity) * 100);

  return (
    <div className={`zone-card ${zone.status}`}>
      <p className="zone-name">{zone.name}</p>
      <div className="queue-bar-track">
        <div className={`queue-bar-fill ${zone.status}`} style={{ width: `${pct}%` }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <StatusBadge status={zone.status} />
        <span style={{ fontSize: 10, color: "var(--color-text-muted)" }}>{zone.queue}/10</span>
      </div>
    </div>
  );
}
