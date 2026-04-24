const router = require("express").Router();
const { getState, triggerSurge, sseConnect } = require("../controllers/venueController");

router.get("/state",  getState);
router.post("/surge", triggerSurge);
router.get("/events", sseConnect);

module.exports = router;
