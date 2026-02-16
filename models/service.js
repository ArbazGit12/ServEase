const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    category: {
        type: String,
        required: true,
        enum: ["Cleaning", "Plumbing", "Electrician", "Cooking", "Gardening", "Painting", "Carpentry", "AC Repair", "Pest Control", "Appliance Repair"]
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    basePrice: {
        type: Number,
        required: true
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    icon: {
        type: String,
        default: "🛠️"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Service", serviceSchema);
