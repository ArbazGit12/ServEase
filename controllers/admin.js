const Booking = require("../models/booking");
const User = require("../models/user");
const Service = require("../models/service");

/**
 * Admin Dashboard - Shows statistics and overview
 */
module.exports.dashboard = async (req, res) => {
    try {
        // Get statistics
        const totalUsers = await User.countDocuments({ role: "user" });
        const totalBookings = await Booking.countDocuments();
        const pendingBookings = await Booking.countDocuments({ status: "Pending" });
        const acceptedBookings = await Booking.countDocuments({ status: "Accepted" });
        const completedBookings = await Booking.countDocuments({ status: "Completed" });
        
        // Calculate revenue (only completed bookings)
        const revenueData = await Booking.aggregate([
            { $match: { status: "Completed" } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);
        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;
        
        // Get recent bookings (last 10)
        const recentBookings = await Booking.find()
            .populate("user", "username email")
            .populate("service", "name category")
            .sort({ createdAt: -1 })
            .limit(10);
        
        // Get most booked service (for recommendations)
        const topServices = await Booking.aggregate([
            { $match: { status: { $in: ["Accepted", "Completed"] } } },
            { $group: { _id: "$service", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        
        const topServiceIds = topServices.map(item => item._id);
        const recommendedServices = await Service.find({ _id: { $in: topServiceIds } });
        
        res.render("admin/dashboard.ejs", {
            stats: {
                totalUsers,
                totalBookings,
                pendingBookings,
                acceptedBookings,
                completedBookings,
                totalRevenue
            },
            recentBookings,
            recommendedServices
        });
    } catch (error) {
        console.error("❌ Admin dashboard error:", error);
        req.flash("error", "Failed to load dashboard");
        res.redirect("/services");
    }
};

/**
 * Show all bookings with filters
 */
module.exports.allBookings = async (req, res) => {
    try {
        const { status, search } = req.query;
        
        // Build query
        let query = {};
        if (status && status !== "all") {
            query.status = status;
        }
        
        const bookings = await Booking.find(query)
            .populate("user", "username email phone")
            .populate("service", "name category icon")
            .sort({ createdAt: -1 });
        
        // Filter by search if provided
        let filteredBookings = bookings;
        if (search) {
            const searchLower = search.toLowerCase();
            filteredBookings = bookings.filter(b => 
                b.user?.username.toLowerCase().includes(searchLower) ||
                b.service?.name.toLowerCase().includes(searchLower) ||
                b.bookingId.toLowerCase().includes(searchLower)
            );
        }
        
        res.render("admin/bookings.ejs", { 
            bookings: filteredBookings,
            currentStatus: status || "all",
            searchTerm: search || ""
        });
    } catch (error) {
        console.error("❌ Admin bookings error:", error);
        req.flash("error", "Failed to load bookings");
        res.redirect("/admin/dashboard");
    }
};

/**
 * Update booking status (AJAX endpoint)
 */
module.exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Validate status
        const validStatuses = ["Pending", "Accepted", "In Progress", "Completed", "Cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid status" 
            });
        }
        
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                message: "Booking not found" 
            });
        }
        
        // Update status
        booking.status = status;
        
        // If completed, set completion date
        if (status === "Completed") {
            booking.completedAt = new Date();
        }
        
        await booking.save();
        
        console.log(`✅ Booking ${booking.bookingId} status updated to ${status}`);
        
        res.json({ 
            success: true, 
            message: `Booking marked as ${status}`,
            booking: {
                id: booking._id,
                bookingId: booking.bookingId,
                status: booking.status
            }
        });
    } catch (error) {
        console.error("❌ Status update error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to update status" 
        });
    }
};

/**
 * Get booking details (API)
 */
module.exports.getBookingDetails = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("user", "username email phone")
            .populate("service", "name category basePrice duration icon");
        
        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                message: "Booking not found" 
            });
        }
        
        res.json({ success: true, booking });
    } catch (error) {
        console.error("❌ Get booking error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch booking" 
        });
    }
};

/**
 * Get pending bookings count (for navbar badge)
 */
module.exports.getPendingCount = async (req, res) => {
    try {
        const count = await Booking.countDocuments({ status: "Pending" });
        res.json({ success: true, count });
    } catch (error) {
        console.error("❌ Pending count error:", error);
        res.status(500).json({ success: false, count: 0 });
    }
};
