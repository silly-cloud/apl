const router        = require("express").Router();
const requireApiKey = require("../middleware/requireApiKey");
const { sendMessage, getHistory } = require("../controllers/chatController");

router.post("/message",           requireApiKey, sendMessage);
router.get("/history/:sessionId",               getHistory);

module.exports = router;
