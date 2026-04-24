const Anthropic = require("@anthropic-ai/sdk");
const { setActiveApiKey, clearActiveApiKey } = require("../services/venueSimulator");

async function validateKey(req, res, next) {
  try {
    const { apiKey } = req.body;

    if (!apiKey || typeof apiKey !== "string" || !apiKey.startsWith("sk-ant-")) {
      return res.status(400).json({
        valid:  false,
        reason: "Invalid key format. Key must start with sk-ant-"
      });
    }

    const client = new Anthropic({ apiKey });

    try {
      await client.messages.create({
        model:      "claude-haiku-4-5-20251001",
        max_tokens: 10,
        messages:   [{ role: "user", content: "hi" }]
      });
    } catch (err) {
      const status = err.status || err.response?.status;
      if (status === 401) {
        return res.status(400).json({ valid: false, reason: "Invalid API key. Check and try again." });
      }
      if (status === 403) {
        return res.status(400).json({ valid: false, reason: "API key does not have permission." });
      }
      if (status === 429) {
        return res.status(400).json({ valid: false, reason: "Rate limited. Key is valid but over quota." });
      }
      return res.status(400).json({ valid: false, reason: "Could not verify key. Try again." });
    }

    res.json({ valid: true });
  } catch (err) {
    next(err);
  }
}

async function notifyConnect(req, res, next) {
  try {
    const key = req.headers["x-venue-api-key"];
    if (key && key.startsWith("sk-ant-")) {
      setActiveApiKey(key);
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function notifyDisconnect(req, res, next) {
  try {
    clearActiveApiKey();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { validateKey, notifyConnect, notifyDisconnect };
