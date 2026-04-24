const VenueState            = require("../models/VenueState");
const OpsAlert              = require("../models/OpsAlert");
const { broadcast }         = require("./sseManager");
const { generateOpsAlerts } = require("./claudeService");
const { SIMULATOR_INTERVAL_MS } = require("../constants");

let _activeApiKey = null;

function setActiveApiKey(key) { _activeApiKey = key; }
function clearActiveApiKey()  { _activeApiKey = null; }

function computeStatus(queue) {
  if (queue <= 3) return "clear";
  if (queue <= 6) return "busy";
  return "critical";
}

function randomWalk(value, min = 0, max = 10) {
  const delta = Math.floor(Math.random() * 3) - 1;
  return Math.min(max, Math.max(min, value + delta));
}

async function tick() {
  try {
    const state = await VenueState.findOne();
    if (!state) return;

    state.zones = state.zones.map(zone => {
      const newQueue = randomWalk(zone.queue);
      return { ...zone.toObject(), queue: newQueue, status: computeStatus(newQueue) };
    });
    state.updatedAt = new Date();
    await state.save();

    broadcast("venueUpdate", state.toObject());

    if (_activeApiKey) {
      try {
        const alertData   = await generateOpsAlerts(state.toObject(), _activeApiKey);
        await OpsAlert.updateMany({ resolvedAt: null }, { resolvedAt: new Date() });
        const savedAlerts = await OpsAlert.insertMany(
          alertData.map(a => ({ ...a, createdAt: new Date() }))
        );
        broadcast("opsAlerts", savedAlerts);
      } catch (claudeErr) {
        console.error("Simulator Claude call failed:", claudeErr.message);
      }
    }
  } catch (err) {
    console.error("Simulator tick error:", err.message);
  }
}

function start() {
  console.log(`Venue simulator started — ticking every ${SIMULATOR_INTERVAL_MS / 1000}s`);
  setInterval(tick, SIMULATOR_INTERVAL_MS);
}

module.exports = { start, tick, computeStatus, setActiveApiKey, clearActiveApiKey };
