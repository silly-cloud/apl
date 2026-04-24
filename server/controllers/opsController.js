const OpsAlert = require("../models/OpsAlert");

async function getAlerts(req, res, next) {
  try {
    const alerts = await OpsAlert.find({ resolvedAt: null }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    next(err);
  }
}

async function resolveAlert(req, res, next) {
  try {
    const alert = await OpsAlert.findByIdAndUpdate(
      req.params.alertId,
      { resolvedAt: new Date() },
      { new: true }
    );
    if (!alert) return res.status(404).json({ error: "Alert not found" });
    res.json(alert);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAlerts, resolveAlert };
