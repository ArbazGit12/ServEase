const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    bookingId: {
        type: String,
        unique: true,
        sparse: true  // Allow multiple undefined values during creation
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: "Service",
        required: true
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    scheduledTime: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "In Progress", "Completed", "Cancelled"],
        default: "Pending"
    },
    estimatedArrivalTime: {
        type: String,
        required: true
    },
    actualArrivalTime: {
        type: String
    },
    totalPrice: {
        type: Number,
        required: true
    },
    specialInstructions: {
        type: String
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    review: {
        type: String
    },
    paymentMethod: {
        type: String,
        enum: ["Cash on Service", "Online Payment"],
        default: "Cash on Service"
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed", "Refunded"],
        default: "Pending"
    },
    razorpayOrderId: {
        type: String
    },
    razorpayPaymentId: {
        type: String
    },
    razorpaySignature: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    }
});

// Generate unique booking ID before saving
bookingSchema.pre("save", function(next) {
    if (!this.bookingId) {
        const date = new Date();
        const timestamp = date.getTime();
        const random = Math.floor(Math.random() * 1000);
        this.bookingId = `BK${timestamp}${random}`;
    }
    next();
});

module.exports = mongoose.model("Booking", bookingSchema);
