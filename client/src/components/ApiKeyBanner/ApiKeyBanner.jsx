import { useState } from "react";
import { useVenueStore } from "../../store/venueStore";
import { validateKey, notifyConnect, notifyDisconnect, setApiKeyHeader } from "../../services/api";

export default function ApiKeyBanner() {
  const { state, dispatch } = useVenueStore();

  const [keyValue,   setKeyValue]   = useState("");
  const [validating, setValidating] = useState(false);
  const [error,      setError]      = useState("");

  const isConnected = !!state.apiKey;

  async function handleConnect() {
    setError("");

    if (!keyValue.trim().startsWith("sk-ant-")) {
      setError("API key must start with sk-ant-");
      return;
    }

    setValidating(true);
    try {
      const result = await validateKey(keyValue.trim());

      if (result.valid) {
        const key = keyValue.trim();
        setApiKeyHeader(key);
        dispatch({ type: "SET_API_KEY", payload: { key, meta: {} } });
        await notifyConnect(key);
        setKeyValue(""); // clear from DOM — never persist
      } else {
        setError(result.reason);
      }
    } catch (err) {
      setError(err.response?.data?.reason || "Validation failed. Check your key and try again.");
    } finally {
      setValidating(false);
    }
  }

  async function handleDisconnect() {
    setApiKeyHeader(null);
    dispatch({ type: "CLEAR_API_KEY" });
    setKeyValue("");
    setError("");
    try { await notifyDisconnect(); } catch { /* best-effort */ }
  }

  if (isConnected) {
    return (
      <div style={{
        padding: "8px 24px",
        borderBottom: "1px solid var(--color-border)",
        background: "var(--color-teal-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: 13,
        flexShrink: 0
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "var(--color-teal)", display: "inline-block"
          }} />
          <span style={{ color: "var(--color-teal)", fontWeight: 600 }}>Connected</span>
          <span style={{ color: "var(--color-text-secondary)" }}>· API key verified</span>
        </span>
        <button
          onClick={handleDisconnect}
          style={{
            fontSize: 12, background: "none", border: "none",
            color: "var(--color-text-secondary)", cursor: "pointer",
            textDecoration: "underline", padding: 0
          }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div style={{
      padding: "12px 24px",
      borderBottom: "1px solid var(--color-border)",
      background: "var(--color-bg-secondary)",
      flexShrink: 0
    }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: 11, color: "var(--color-text-secondary)", fontWeight: 500 }}>
            Anthropic API Key
          </label>
          <input
            type="password"
            value={keyValue}
            onChange={e => { setKeyValue(e.target.value); setError(""); }}
            onKeyDown={e => { if (e.key === "Enter") handleConnect(); }}
            placeholder="sk-ant-api03-..."
            disabled={validating}
            autoComplete="off"
            style={{
              padding: "7px 12px",
              fontSize: 13,
              borderRadius: "var(--radius-md)",
              border: `1px solid ${error ? "var(--color-red)" : "var(--color-border)"}`,
              background: "var(--color-bg)",
              color: "var(--color-text-primary)",
              width: 320,
              outline: "none",
              transition: "border-color 0.15s"
            }}
          />
        </div>
        <button
          onClick={handleConnect}
          disabled={validating || !keyValue.trim()}
          style={{
            padding: "7px 20px",
            background: validating || !keyValue.trim()
              ? "var(--color-bg-tertiary)"
              : "var(--color-teal)",
            color: validating || !keyValue.trim()
              ? "var(--color-text-muted)"
              : "#fff",
            border: "none",
            borderRadius: "var(--radius-md)",
            fontSize: 13,
            fontWeight: 600,
            cursor: validating || !keyValue.trim() ? "not-allowed" : "pointer",
            transition: "all 0.15s",
            alignSelf: "flex-end"
          }}
        >
          {validating ? "Verifying…" : "Connect"}
        </button>
      </div>
      {error && (
        <p style={{ fontSize: 12, color: "var(--color-red)", marginTop: 8 }}>{error}</p>
      )}
      <p style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 6 }}>
        Get your key at console.anthropic.com → Settings → API Keys
      </p>
    </div>
  );
}
