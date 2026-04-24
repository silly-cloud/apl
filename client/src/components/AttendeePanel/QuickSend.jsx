const QUICK_SENDS = [
  "Where's the shortest food queue?",
  "Which gate is least busy right now?",
  "I'm in North Stand — nearest restroom?"
];

export default function QuickSend({ onSend }) {
  return (
    <div className="quick-sends">
      {QUICK_SENDS.map(q => (
        <button key={q} className="btn-quick" onClick={() => onSend(q)}>
          {q}
        </button>
      ))}
    </div>
  );
}
