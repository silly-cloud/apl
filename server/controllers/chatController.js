const ChatMessage              = require("../models/ChatMessage");
const VenueState               = require("../models/VenueState");
const { generateAttendeeStream } = require("../services/claudeService");

async function sendMessage(req, res, next) {
  const { message, sessionId } = req.body;
  const apiKey = req.anthropicApiKey;

  if (!message || !sessionId) {
    return res.status(400).json({ error: "message and sessionId are required" });
  }

  try {
    await ChatMessage.create({ role: "user", content: message, sessionId });

    const [venueState, history] = await Promise.all([
      VenueState.findOne(),
      ChatMessage.find({ sessionId }).sort({ createdAt: 1 }).limit(6)
    ]);

    res.setHeader("Content-Type",  "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection",    "keep-alive");
    res.flushHeaders();

    const stream   = await generateAttendeeStream(message, venueState?.toObject(), history, apiKey);
    let   fullText = "";

    for await (const chunk of stream) {
      if (chunk.type === "content_block_delta" && chunk.delta?.type === "text_delta") {
        const text = chunk.delta.text;
        fullText  += text;
        res.write(`event: delta\ndata: ${JSON.stringify({ text })}\n\n`);
      }
    }

    const actionMatch    = fullText.match(/^ACTION:\s*(.+)$/m);
    const action         = actionMatch ? actionMatch[1].trim() : null;
    const displayContent = fullText.replace(/^ACTION:.*$/m, "").trim();

    await ChatMessage.create({ role: "assistant", content: displayContent, action, sessionId });

    res.write(`event: done\ndata: ${JSON.stringify({ action })}\n\n`);
    res.end();
  } catch (err) {
    next(err);
  }
}

async function getHistory(req, res, next) {
  try {
    const messages = await ChatMessage.find({ sessionId: req.params.sessionId })
      .sort({ createdAt: 1 })
      .limit(20);
    res.json(messages);
  } catch (err) {
    next(err);
  }
}

module.exports = { sendMessage, getHistory };
