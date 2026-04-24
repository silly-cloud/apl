import { useState } from "react";
import { triggerSurge } from "../../services/api";

export default function SurgeButton() {
  const [loading, setLoading] = useState(false);

  async function handleSurge() {
    setLoading(true);
    try {
      await triggerSurge();
    } catch (err) {
      console.error("Surge failed:", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button className="btn-surge" onClick={handleSurge} disabled={loading}>
      {loading ? "Simulating…" : "⚡ Simulate crowd surge"}
    </button>
  );
}
