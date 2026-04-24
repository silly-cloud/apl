export default function AlertCard({ alert, onResolve }) {
  return (
    <div className={`alert-card ${alert.severity}`}>
      <div className="alert-body">
        {alert.severity === "CRITICAL" && <span className="pulse-dot" />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="alert-text">{alert.message}</p>
          <p className="alert-zone">{alert.zone}</p>
        </div>
      </div>
      <button className="btn-resolve" onClick={() => onResolve(alert._id)}>
        Resolve
      </button>
    </div>
  );
}
