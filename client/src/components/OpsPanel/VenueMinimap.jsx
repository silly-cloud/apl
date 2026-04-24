import { useVenueStore } from "../../store/venueStore";

const POSITIONS = {
  gate_a:      { cx: 67,  cy: 140, lx: 67,  ly: 126, anchor: "middle" },
  gate_b:      { cx: 253, cy: 140, lx: 253, ly: 126, anchor: "middle" },
  north_stand: { cx: 160, cy: 22,  lx: 160, ly: 40,  anchor: "middle" },
  south_stand: { cx: 160, cy: 165, lx: 160, ly: 152, anchor: "middle" },
  conc_east:   { cx: 290, cy: 92,  lx: 290, ly: 78,  anchor: "middle" },
  conc_west:   { cx: 30,  cy: 92,  lx: 30,  ly: 78,  anchor: "middle" }
};

function qColor(q) {
  if (q <= 3) return "#1D9E75";
  if (q <= 6) return "#BA7517";
  return "#E24B4A";
}

export default function VenueMinimap() {
  const { state } = useVenueStore();
  const zones     = state.venueState?.zones || [];
  const zoneMap   = Object.fromEntries(zones.map(z => [z.id, z]));

  return (
    <div className="minimap-wrap">
      <p className="section-label">Venue map</p>
      <svg viewBox="0 0 320 190" width="100%" style={{ display: "block" }}>
        {/* Outer oval — stadium perimeter */}
        <ellipse
          cx="160" cy="95" rx="148" ry="82"
          fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="7 4" opacity="0.12"
        />
        {/* Seating ring */}
        <ellipse
          cx="160" cy="95" rx="130" ry="70"
          fill="none" stroke="currentColor" strokeWidth="7" opacity="0.05"
        />
        {/* Pitch */}
        <ellipse cx="160" cy="95" rx="82" ry="45" fill="#1a3a1a" opacity="0.35" />
        <ellipse cx="160" cy="95" rx="82" ry="45" fill="none" stroke="#2d5a2d" strokeWidth="1" />
        {/* Centre line */}
        <line x1="78" y1="95" x2="242" y2="95" stroke="#2d5a2d" strokeWidth="0.8" opacity="0.45" />
        {/* Centre circle */}
        <circle cx="160" cy="95" r="18" fill="none" stroke="#2d5a2d" strokeWidth="0.8" opacity="0.45" />

        {/* Zone dots */}
        {Object.entries(POSITIONS).map(([id, pos]) => {
          const zone  = zoneMap[id];
          const color = zone ? qColor(zone.queue) : "#888";
          const label = zone?.name.replace("Concessions ", "Conc. ") ?? id;

          return (
            <g key={id}>
              {/* Glow */}
              <circle cx={pos.cx} cy={pos.cy} r={15} fill={color} opacity={0.15} />
              {/* Dot */}
              <circle cx={pos.cx} cy={pos.cy} r={10} fill={color} stroke="#fff" strokeWidth={1.5} />
              {/* Queue count */}
              <text
                x={pos.cx} y={pos.cy + 3.5}
                textAnchor="middle" fontSize="9" fontWeight="700"
                fontFamily="system-ui, sans-serif" fill="#fff"
              >
                {zone?.queue ?? "—"}
              </text>
              {/* Zone label */}
              <text
                x={pos.lx} y={pos.ly}
                textAnchor={pos.anchor} fontSize="8.5" fontWeight="600"
                fontFamily="system-ui, sans-serif" fill={color}
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
