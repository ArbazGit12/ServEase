const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const serviceController = require("../controllers/services");

// List all services
router.get("/", wrapAsync(serviceController.index));

// Show individual service
router.get("/:id", wrapAsync(serviceController.showService));

module.exports = router;
