const mongoose = require("mongoose");

const zoneSchema = new mongoose.Schema({
  id:       { type: String, required: true },
  name:     { type: String, required: true },
  queue:    { type: Number, required: true, min: 0, max: 10 },
  capacity: { type: Number, required: true, default: 10 },
  open:     { type: Boolean, default: true },
  status:   { type: String, enum: ["clear", "busy", "critical"], default: "clear" }
}, { _id: false });

const venueStateSchema = new mongoose.Schema({
  zones:      { type: [zoneSchema], required: true },
  event:      { type: String, required: true },
  attendance: { type: Number, required: true },
  updatedAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model("VenueState", venueStateSchema);
