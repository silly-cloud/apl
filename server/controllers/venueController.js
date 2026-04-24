const VenueState              = require("../models/VenueState");
const OpsAlert                = require("../models/OpsAlert");
const { broadcast }           = require("../services/sseManager");
const { generateOpsAlerts }   = require("../services/claudeService");
const { addClient, removeClient } = require("../services/sseManager");
const { computeStatus }       = require("../services/venueSimulator");

async function getState(req, res, next) {
  try {
    const state = await VenueState.findOne();
    if (!state) return res.status(404).json({ error: "No venue state found" });
    res.json(state);
  } catch (err) {
    next(err);
  }
}

async function triggerSurge(req, res, next) {
  try {
    const apiKey = req.headers["x-venue-api-key"];
    const state  = await VenueState.findOne();
    if (!state) return res.status(404).json({ error: "No venue state found" });

    state.zones = state.zones.map(zone => {
      const newQueue = zone.id === "gate_a" ? 10 : zone.id === "conc_east" ? 9 : zone.queue;
      return { ...zone.toObject(), queue: newQueue, status: computeStatus(newQueue) };
    });
    state.updatedAt = new Date();
    await state.save();

    broadcast("venueUpdate", state.toObject());

    let savedAlerts = [];
    if (apiKey) {
      const alertData = await generateOpsAlerts(state.toObject(), apiKey);
      await OpsAlert.updateMany({ resolvedAt: null }, { resolvedAt: new Date() });
      savedAlerts = await OpsAlert.insertMany(
        alertData.map(a => ({ ...a, createdAt: new Date() }))
      );
      broadcast("opsAlerts", savedAlerts);
    }

    res.json({ state: state.toObject(), alerts: savedAlerts });
  } catch (err) {
    next(err);
  }
}

function sseConnect(req, res) {
  res.setHeader("Content-Type",  "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection",    "keep-alive");
  res.flushHeaders();

  addClient(res);

  VenueState.findOne().then(state => {
    if (state) res.write(`event: venueUpdate\ndata: ${JSON.stringify(state.toObject())}\n\n`);
  });

  OpsAlert.find({ resolvedAt: null }).sort({ createdAt: -1 }).then(alerts => {
    if (alerts.length) res.write(`event: opsAlerts\ndata: ${JSON.stringify(alerts)}\n\n`);
  });

  req.on("close", () => removeClient(res));
}

module.exports = { getState, triggerSurge, sseConnect };
