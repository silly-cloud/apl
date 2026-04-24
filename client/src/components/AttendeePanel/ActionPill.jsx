export default function ActionPill({ label, onClick }) {
  return (
    <button className="action-pill" onClick={onClick}>
      {label}
    </button>
  );
}
