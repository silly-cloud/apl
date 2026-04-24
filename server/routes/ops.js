const router = require("express").Router();
const { getAlerts, resolveAlert } = require("../controllers/opsController");

router.get("/alerts",                    getAlerts);
router.patch("/alerts/:alertId/resolve", resolveAlert);

module.exports = router;
