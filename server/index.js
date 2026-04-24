require("dotenv").config();
const express    = require("express");
const mongoose   = require("mongoose");
const cors       = require("cors");
const morgan     = require("morgan");

const authRoutes   = require("./routes/auth");
const venueRoutes  = require("./routes/venue");
const chatRoutes   = require("./routes/chat");
const opsRoutes    = require("./routes/ops");
const errorHandler = require("./middleware/errorHandler");
const { start: startSimulator } = require("./services/venueSimulator");
const VenueState   = require("./models/VenueState");
const { ZONES, EVENT_NAME, ATTENDANCE } = require("./constants");

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth",  authRoutes);
app.use("/api/venue", venueRoutes);
app.use("/api/chat",  chatRoutes);
app.use("/api/ops",   opsRoutes);
app.get("/api/health", (_req, res) => res.json({ status: "ok", ts: new Date() }));

app.use(errorHandler);

async function seed() {
  const existing = await VenueState.findOne();
  if (!existing) {
    await VenueState.create({
      zones: ZONES,
      event: EVENT_NAME,
      attendance: ATTENDANCE,
      updatedAt: new Date()
    });
    console.log("VenueState seeded");
  }
}

async function boot() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    await seed();
    startSimulator();
    app.listen(PORT, () => console.log(`Server on :${PORT}`));
  } catch (err) {
    console.error("Boot failed:", err.message);
    process.exit(1);
  }
}

boot();
