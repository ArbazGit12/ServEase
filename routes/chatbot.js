const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const chatbotController = require("../controllers/chatbot");

// Process chatbot message
router.post("/message", wrapAsync(chatbotController.processMessage));

// Quick book service
router.post("/quick-book", wrapAsync(chatbotController.quickBook));

module.exports = router;
