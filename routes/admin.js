const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isAdmin } = require("../middleware");
const adminController = require("../controllers/admin");

// Admin dashboard
router.get("/dashboard", isAdmin, wrapAsync(adminController.dashboard));

// All bookings page
router.get("/bookings", isAdmin, wrapAsync(adminController.allBookings));

// API: Update booking status
router.patch("/bookings/:id/status", isAdmin, wrapAsync(adminController.updateStatus));

// API: Get booking details
router.get("/bookings/:id", isAdmin, wrapAsync(adminController.getBookingDetails));

// API: Get pending bookings count (for navbar badge)
router.get("/api/pending-count", isAdmin, wrapAsync(adminController.getPendingCount));

module.exports = router;
