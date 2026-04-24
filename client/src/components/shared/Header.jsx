import { useVenueStore } from "../../store/venueStore";

export default function Header() {
  const { state } = useVenueStore();

  return (
    <header style={{
      padding: "14px 24px",
      borderBottom: "1px solid var(--color-border)",
      background: "var(--color-header)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexShrink: 0,
      boxShadow: "var(--shadow-sm)"
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.3px" }}>VenueIQ</span>
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
          Smart Venue Assistant
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: state.isConnected ? "var(--color-green)" : "var(--color-red)",
          display: "inline-block",
          transition: "background 0.3s"
        }} />
        <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
          {state.isConnected ? "Live" : "Offline"}
        </span>
      </div>
    </header>
  );
}
