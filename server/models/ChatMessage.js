const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  role:      { type: String, enum: ["user", "assistant"], required: true },
  content:   { type: String, required: true },
  action:    { type: String, default: null },
  sessionId: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now }
});

chatMessageSchema.index({ sessionId: 1, createdAt: 1 });

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
