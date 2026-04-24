const router = require("express").Router();
const { validateKey, notifyConnect, notifyDisconnect } = require("../controllers/authController");

router.post("/validate-key", validateKey);
router.post("/connect",      notifyConnect);
router.post("/disconnect",   notifyDisconnect);

module.exports = router;
