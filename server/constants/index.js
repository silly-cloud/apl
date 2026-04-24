const ZONES = [
  { id: "gate_a",      name: "Gate A",           queue: 3, capacity: 10, open: true },
  { id: "gate_b",      name: "Gate B",            queue: 1, capacity: 10, open: true },
  { id: "north_stand", name: "North Stand",       queue: 2, capacity: 10, open: true },
  { id: "south_stand", name: "South Stand",       queue: 5, capacity: 10, open: true },
  { id: "conc_east",   name: "Concessions East",  queue: 7, capacity: 10, open: true },
  { id: "conc_west",   name: "Concessions West",  queue: 2, capacity: 10, open: true }
];

const EVENT_NAME = "Premier League Match — Kickoff 15:00";
const ATTENDANCE = 42000;
const SIMULATOR_INTERVAL_MS = 30000;

const ZONE_STATUS = {
  CLEAR:    "clear",
  BUSY:     "busy",
  CRITICAL: "critical"
};

const ALERT_SEVERITY = {
  CRITICAL: "CRITICAL",
  WARNING:  "WARNING",
  INFO:     "INFO"
};

const QUICK_SENDS = [
  "Where's the shortest food queue?",
  "Which gate is least busy right now?",
  "I'm in North Stand — where's the nearest restroom?"
];

const ATTENDEE_SYSTEM_PROMPT = `You are VenueIQ, a smart AI assistant for attendees at a live sporting event.
You have real-time access to current venue conditions. Be friendly, specific, and concise — max 3 sentences.
Always ground your answer in the actual venue data provided. Never invent queue lengths or directions.
End every response with exactly one line in this exact format:
ACTION: <short imperative label, max 5 words>
Example: ACTION: Head to Gate B now`;

const OPS_SYSTEM_PROMPT = `You are an operations AI for a large sporting venue.
Analyze the venue state and output exactly 2 staff dispatch alerts.
Each alert must be on its own line in this exact format: SEVERITY|ZONE_ID|MESSAGE
Severity must be one of: CRITICAL, WARNING, INFO
Message must be under 20 words and action-oriented.
Output only the 2 lines. No preamble, no explanation, nothing else.`;

const ANTHROPIC_ADMIN_API_BASE = "https://api.anthropic.com/v1";
const ANTHROPIC_API_VERSION    = "2023-06-01";

module.exports = {
  ZONES,
  EVENT_NAME,
  ATTENDANCE,
  SIMULATOR_INTERVAL_MS,
  ZONE_STATUS,
  ALERT_SEVERITY,
  QUICK_SENDS,
  ATTENDEE_SYSTEM_PROMPT,
  OPS_SYSTEM_PROMPT,
  ANTHROPIC_ADMIN_API_BASE,
  ANTHROPIC_API_VERSION
};
