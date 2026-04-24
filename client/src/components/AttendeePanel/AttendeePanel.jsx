import { useRef, useEffect, useState } from "react";
import { useChat } from "../../hooks/useChat";
import ChatMessage    from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import QuickSend      from "./QuickSend";

export default function AttendeePanel() {
  const { messages, isStreaming, sendMessage } = useChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    sendMessage(text);
  }

  return (
    <div className="panel panel-left">
      <div className="panel-header">
        <h2>Attendee assistant</h2>
        <p>Ask anything about the venue</p>
      </div>

      <div className="chat-list">
        {messages.map(m => (
          <ChatMessage key={m.id} message={m} onAction={sendMessage} />
        ))}
        {isStreaming && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-bar">
        <div className="chat-input-row">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask about queues, gates, food…"
            disabled={isStreaming}
          />
          <button
            className="btn-send"
            onClick={handleSend}
            disabled={isStreaming || !input.trim()}
          >
            Send
          </button>
        </div>
        <QuickSend onSend={sendMessage} />
      </div>
    </div>
  );
}
