import { useState, useCallback, useRef } from "react";
import { v4 as uuid } from "uuid";
import { sendMessageStream } from "../services/api";
import { useVenueStore } from "../store/venueStore";

const SESSION_KEY = "venueiq_session";

function getSessionId() {
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = uuid();
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

export function useChat() {
  const { state }                      = useVenueStore();
  const [messages, setMessages]        = useState([]);
  const [isStreaming, setStreaming]     = useState(false);
  const sessionId                      = useRef(getSessionId());

  function addMessage(msg) {
    setMessages(prev => [...prev, msg]);
  }

  function updateLast(fn) {
    setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? fn(m) : m));
  }

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isStreaming) return;

    if (!state.apiKey) {
      addMessage({
        id:        uuid(),
        role:      "assistant",
        content:   "Please connect your Anthropic API key using the banner above.",
        action:    null,
        streaming: false
      });
      return;
    }

    addMessage({ id: uuid(), role: "user",      content: text, action: null, streaming: false });
    addMessage({ id: uuid(), role: "assistant", content: "",   action: null, streaming: true  });
    setStreaming(true);

    try {
      const res    = await sendMessageStream(text, sessionId.current, state.apiKey);
      const reader = res.body.getReader();
      const dec    = new TextDecoder();
      let   buf    = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop();

        let event = null;
        for (const line of lines) {
          if (line.startsWith("event: ")) {
            event = line.slice(7).trim();
          } else if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if      (event === "delta") updateLast(m => ({ ...m, content: m.content + data.text }));
              else if (event === "done")  updateLast(m => ({ ...m, action: data.action, streaming: false }));
            } catch (_) { /* ignore malformed JSON */ }
            event = null;
          }
        }
      }
    } catch {
      updateLast(m => ({
        ...m,
        content:   "Sorry, I couldn't reach the venue system. Please try again.",
        streaming: false
      }));
    } finally {
      setStreaming(false);
    }
  }, [isStreaming, state.apiKey]);

  return { messages, isStreaming, sendMessage };
}
