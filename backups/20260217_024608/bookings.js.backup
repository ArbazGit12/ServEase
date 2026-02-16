const Booking = require("../models/booking");
const Service = require("../models/service");
const moment = require("moment");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Calculate estimated arrival time (15 minutes as per requirement)
const calculateArrivalTime = (scheduledDate, scheduledTime) => {
    const dateTime = moment(`${scheduledDate} ${scheduledTime}`, 'YYYY-MM-DD HH:mm');
    const arrivalTime = dateTime.add(15, 'minutes');
    return arrivalTime.format('hh:mm A');
};

module.exports.renderBookingForm = async (req, res) => {
    const service = await Service.findById(req.params.serviceId);
    if (!service) {
        req.flash("error", "Service not found!");
        return res.redirect("/services");
    }
    
    // Pre-fill user's address if available
    const userAddress = req.user.address || {};
    
    res.render("bookings/new_updated.ejs", { service, userAddress });
};

module.exports.createBooking = async (req, res) => {
    try {
        const { serviceId, scheduledDate, scheduledTime, address, specialInstructions, paymentMethod } = req.body;
        
        console.log("📝 Creating booking with data:", { serviceId, scheduledDate, scheduledTime, address, paymentMethod });
        
        // Validate required fields
        if (!serviceId || !scheduledDate || !scheduledTime) {
            req.flash("error", "Please fill all required fields (service, date, time)");
            return res.redirect("/services");
        }
        
        if (!address || !address.street || !address.city || !address.pincode) {
            req.flash("error", "Please provide complete address details");
            return res.redirect(`/bookings/new/${serviceId}`);
        }
        
        const service = await Service.findById(serviceId);
        if (!service) {
            req.flash("error", "Service not found!");
            return res.redirect("/services");
        }
        
        console.log("✅ Service found:", service.name);
        
        // Calculate estimated arrival time
        const estimatedArrivalTime = calculateArrivalTime(scheduledDate, scheduledTime);
        
        const newBooking = new Booking({
            user: req.user._id,
            service: serviceId,
            scheduledDate,
            scheduledTime,
            address: {
                street: address.street,
                city: address.city,
                state: address.state || '',
                pincode: address.pincode
            },
            totalPrice: service.basePrice,
            estimatedArrivalTime,
            specialInstructions: specialInstructions || '',
            status: "Pending",
            paymentMethod: paymentMethod || "Cash on Service",
            paymentStatus: paymentMethod === "Cash on Service" ? "Pending" : "Pending"
        });
        
        const savedBooking = await newBooking.save();
        console.log("✅ Booking saved successfully:", savedBooking.bookingId);
        
        req.flash("success", `Booking confirmed! Your booking ID is ${savedBooking.bookingId}. Service provider will arrive by ${estimatedArrivalTime}`);
        res.redirect(`/bookings/${savedBooking._id}`);
    } catch (error) {
        console.error("❌ Booking creation error:", error);
        req.flash("error", `Failed to create booking: ${error.message}`);
        res.redirect("/services");
    }
};

// Create Razorpay order
module.exports.createOrder = async (req, res) => {
    try {
        const { serviceId, scheduledDate, scheduledTime, address } = req.body;
        
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.json({ success: false, message: "Service not found" });
        }
        
        // Create Razorpay order
        const options = {
            amount: service.basePrice * 100, // amount in paise
            currency: "INR",
            receipt: `order_${Date.now()}`,
            notes: {
                serviceId: service._id.toString(),
                serviceName: service.name,
                userId: req.user._id.toString(),
                username: req.user.username
            }
        };
        
        const order = await razorpay.orders.create(options);
        
        console.log("✅ Razorpay order created:", order.id);
        
        res.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            razorpayKeyId: process.env.RAZORPAY_KEY_ID,
            serviceName: service.name
        });
        
    } catch (error) {
        console.error("❌ Error creating order:", error);
        res.json({ 
            success: false, 
            message: error.message || "Failed to create order" 
        });
    }
};

// Verify payment and create booking
module.exports.verifyPayment = async (req, res) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature,
            bookingData 
        } = req.body;
        
        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");
        
        const isAuthentic = expectedSignature === razorpay_signature;
        
        if (!isAuthentic) {
            console.error("❌ Invalid payment signature");
            return res.json({ 
                success: false, 
                message: "Payment verification failed" 
            });
        }
        
        console.log("✅ Payment signature verified");
        
        // Create booking with payment details
        const service = await Service.findById(bookingData.serviceId);
        const estimatedArrivalTime = calculateArrivalTime(
            bookingData.scheduledDate, 
            bookingData.scheduledTime
        );
        
        const newBooking = new Booking({
            user: req.user._id,
            service: bookingData.serviceId,
            scheduledDate: bookingData.scheduledDate,
            scheduledTime: bookingData.scheduledTime,
            address: {
                street: bookingData['address[street]'],
                city: bookingData['address[city]'],
                state: bookingData['address[state]'] || '',
                pincode: bookingData['address[pincode]']
            },
            totalPrice: service.basePrice,
            estimatedArrivalTime,
            specialInstructions: bookingData.specialInstructions || '',
            status: "Pending",
            paymentMethod: "Online Payment",
            paymentStatus: "Paid",
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature
        });
        
        const savedBooking = await newBooking.save();
        console.log("✅ Booking created with payment:", savedBooking.bookingId);
        
        res.json({
            success: true,
            bookingId: savedBooking._id,
            message: "Booking confirmed with payment"
        });
        
    } catch (error) {
        console.error("❌ Payment verification error:", error);
        res.json({ 
            success: false, 
            message: error.message || "Payment verification failed" 
        });
    }
};

module.exports.showBooking = async (req, res) => {
    const booking = await Booking.findById(req.params.id)
        .populate("service")
        .populate("user");
    
    if (!booking) {
        req.flash("error", "Booking not found!");
        return res.redirect("/bookings/history");
    }
    
    // Check if user owns this booking
    if (!booking.user._id.equals(req.user._id)) {
        req.flash("error", "You don't have permission to view this booking");
        return res.redirect("/bookings/history");
    }
    
    res.render("bookings/show.ejs", { booking });
};

module.exports.bookingHistory = async (req, res) => {
    try {
        console.log("📋 Fetching booking history for user:", req.user._id);
        
        const bookings = await Booking.find({ user: req.user._id })
            .populate("service")
            .sort({ createdAt: -1 });
        
        console.log("📋 Found bookings:", bookings.length);
        
        res.render("bookings/history.ejs", { bookings });
    } catch (error) {
        console.error("❌ Error fetching booking history:", error);
        req.flash("error", "Failed to load booking history");
        res.redirect("/services");
    }
};

module.exports.cancelBooking = async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
        req.flash("error", "Booking not found!");
        return res.redirect("/bookings/history");
    }
    
    if (!booking.user.equals(req.user._id)) {
        req.flash("error", "You don't have permission to cancel this booking");
        return res.redirect("/bookings/history");
    }
    
    if (booking.status === "Completed" || booking.status === "Cancelled") {
        req.flash("error", "This booking cannot be cancelled");
        return res.redirect(`/bookings/${booking._id}`);
    }
    
    booking.status = "Cancelled";
    
    // Handle refund for online payments
    if (booking.paymentMethod === "Online Payment" && booking.paymentStatus === "Paid") {
        booking.paymentStatus = "Refunded";
        req.flash("info", "Your payment will be refunded within 5-7 business days");
    }
    
    await booking.save();
    
    req.flash("success", "Booking cancelled successfully");
    res.redirect("/bookings/history");
};

module.exports.rateBooking = async (req, res) => {
    const { rating, review } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
        req.flash("error", "Booking not found!");
        return res.redirect("/bookings/history");
    }
    
    if (!booking.user.equals(req.user._id)) {
        req.flash("error", "You don't have permission to rate this booking");
        return res.redirect("/bookings/history");
    }
    
    booking.rating = rating;
    booking.review = review;
    await booking.save();
    
    req.flash("success", "Thank you for your feedback!");
    res.redirect(`/bookings/${booking._id}`);
};
