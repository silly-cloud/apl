const Anthropic = require("@anthropic-ai/sdk");
const { ATTENDEE_SYSTEM_PROMPT, OPS_SYSTEM_PROMPT } = require("../constants");

/**
 * Stream a response to an attendee message.
 * Returns an Anthropic stream object — caller is responsible for iterating it.
 * apiKey is always supplied as a parameter; never read from process.env in production paths.
 */
async function generateAttendeeStream(userMessage, venueState, chatHistory, apiKey) {
  const client = new Anthropic({ apiKey });

  const system = ATTENDEE_SYSTEM_PROMPT +
    `\n\nCurrent venue state:\n${JSON.stringify(venueState, null, 2)}`;

  const messages = [
    ...chatHistory.map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage }
  ];

  return client.messages.stream({
    model:      "claude-sonnet-4-6",
    max_tokens: 400,
    system,
    messages
  });
}

/**
 * Generate 2 ops alerts for the current venue state.
 * Returns array of { severity, zone, message }.
 * apiKey is always supplied as a parameter; never read from process.env in production paths.
 */
async function generateOpsAlerts(venueState, apiKey) {
  const client = new Anthropic({ apiKey });

  const system = OPS_SYSTEM_PROMPT +
    `\n\nCurrent venue state:\n${JSON.stringify(venueState, null, 2)}`;

  const response = await client.messages.create({
    model:      "claude-sonnet-4-6",
    max_tokens: 200,
    system,
    messages: [{ role: "user", content: "Generate the 2 alerts now." }]
  });

  const raw    = response.content[0]?.text || "";
  const alerts = [];

  raw.trim().split("\n").forEach(line => {
    const parts = line.split("|");
    if (parts.length >= 3) {
      const [severity, zone, ...rest] = parts;
      if (["CRITICAL", "WARNING", "INFO"].includes(severity.trim())) {
        alerts.push({
          severity: severity.trim(),
          zone:     zone.trim(),
          message:  rest.join("|").trim()
        });
      }
    }
  });

  return alerts.slice(0, 2);
}

module.exports = { generateAttendeeStream, generateOpsAlerts };
