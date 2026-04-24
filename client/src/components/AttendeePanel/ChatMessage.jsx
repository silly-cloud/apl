import ActionPill from "./ActionPill";

export default function ChatMessage({ message, onAction }) {
  if (message.role === "user") {
    return <div className="msg-user">{message.content}</div>;
  }

  return (
    <div className="msg-assistant">
      <p>{message.content || " "}</p>
      {message.action && !message.streaming && (
        <ActionPill label={message.action} onClick={() => onAction(message.action)} />
      )}
    </div>
  );
}
