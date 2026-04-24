const mongoose = require("mongoose");

const opsAlertSchema = new mongoose.Schema({
  severity:   { type: String, enum: ["CRITICAL", "WARNING", "INFO"], required: true },
  zone:       { type: String, required: true },
  message:    { type: String, required: true },
  resolvedAt: { type: Date, default: null },
  createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model("OpsAlert", opsAlertSchema);
