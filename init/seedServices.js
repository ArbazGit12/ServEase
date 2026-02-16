const mongoose = require("mongoose");
const Service = require("../models/service");

require("dotenv").config({ path: "../.env" });

const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/serviceBooking";

main()
    .then(() => {
        console.log("✅ Database connected");
        initDB();
    })
    .catch((err) => {
        console.log("❌ Database connection error:", err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

const initialServices = [
    // Cleaning Services
    {
        category: "Cleaning",
        name: "Full House Cleaning",
        description: "Complete house cleaning including all rooms, kitchen, and bathrooms",
        basePrice: 999,
        duration: 120,
        icon: "🧹"
    },
    {
        category: "Cleaning",
        name: "Deep Cleaning",
        description: "Intensive deep cleaning with carpet shampooing and upholstery cleaning",
        basePrice: 1499,
        duration: 180,
        icon: "✨"
    },
    {
        category: "Cleaning",
        name: "Kitchen Cleaning",
        description: "Complete kitchen cleaning including appliances, cabinets, and surfaces",
        basePrice: 599,
        duration: 90,
        icon: "🍳"
    },
    
    // Plumbing Services
    {
        category: "Plumbing",
        name: "Tap Repair",
        description: "Fix leaking or damaged taps and faucets",
        basePrice: 299,
        duration: 45,
        icon: "🚰"
    },
    {
        category: "Plumbing",
        name: "Drain Cleaning",
        description: "Clear blocked drains and pipes",
        basePrice: 499,
        duration: 60,
        icon: "🔧"
    },
    {
        category: "Plumbing",
        name: "Bathroom Plumbing",
        description: "Complete bathroom plumbing solutions including toilet and shower",
        basePrice: 799,
        duration: 120,
        icon: "🚿"
    },
    
    // Electrician Services
    {
        category: "Electrician",
        name: "Wiring & Installation",
        description: "Electrical wiring, switch, and socket installation",
        basePrice: 699,
        duration: 90,
        icon: "💡"
    },
    {
        category: "Electrician",
        name: "Fan Installation",
        description: "Ceiling fan installation and repair",
        basePrice: 399,
        duration: 60,
        icon: "🌀"
    },
    {
        category: "Electrician",
        name: "Light Fixture Repair",
        description: "Repair and installation of light fixtures",
        basePrice: 349,
        duration: 45,
        icon: "🔦"
    },
    
    // Cooking Services
    {
        category: "Cooking",
        name: "Daily Meal Cooking",
        description: "Professional cook for daily meals",
        basePrice: 499,
        duration: 120,
        icon: "👨‍🍳"
    },
    {
        category: "Cooking",
        name: "Party Catering",
        description: "Cooking service for parties and events",
        basePrice: 1999,
        duration: 240,
        icon: "🎉"
    },
    {
        category: "Cooking",
        name: "Tiffin Service",
        description: "Healthy home-cooked tiffin service delivered daily",
        basePrice: 899,
        duration: 90,
        icon: "🍱"
    },
    
    // Gardening Services
    {
        category: "Gardening",
        name: "Lawn Mowing",
        description: "Professional lawn mowing and maintenance",
        basePrice: 599,
        duration: 90,
        icon: "🌱"
    },
    {
        category: "Gardening",
        name: "Plant Care",
        description: "Plant watering, pruning, and general care",
        basePrice: 399,
        duration: 60,
        icon: "🌿"
    },
    {
        category: "Gardening",
        name: "Garden Landscaping",
        description: "Complete garden design and landscaping service",
        basePrice: 2499,
        duration: 360,
        icon: "🌳"
    },
    
    // Painting Services
    {
        category: "Painting",
        name: "Room Painting",
        description: "Interior room painting with premium quality paint",
        basePrice: 2999,
        duration: 480,
        icon: "🎨"
    },
    {
        category: "Painting",
        name: "Wall Touch-up",
        description: "Minor wall repairs and touch-up painting",
        basePrice: 799,
        duration: 120,
        icon: "🖌️"
    },
    {
        category: "Painting",
        name: "Exterior Painting",
        description: "Weather-resistant exterior wall painting",
        basePrice: 3999,
        duration: 600,
        icon: "🏠"
    },
    
    // Carpentry Services
    {
        category: "Carpentry",
        name: "Furniture Repair",
        description: "Repair and restoration of wooden furniture",
        basePrice: 599,
        duration: 90,
        icon: "🪚"
    },
    {
        category: "Carpentry",
        name: "Door & Window Repair",
        description: "Repair and installation of doors and windows",
        basePrice: 899,
        duration: 120,
        icon: "🚪"
    },
    {
        category: "Carpentry",
        name: "Custom Furniture Making",
        description: "Custom wooden furniture design and creation",
        basePrice: 4999,
        duration: 480,
        icon: "🛋️"
    },
    
    // AC Repair
    {
        category: "AC Repair",
        name: "AC Service",
        description: "Complete AC servicing and maintenance",
        basePrice: 799,
        duration: 90,
        icon: "❄️"
    },
    {
        category: "AC Repair",
        name: "AC Installation",
        description: "New AC installation service",
        basePrice: 1499,
        duration: 150,
        icon: "🌡️"
    },
    {
        category: "AC Repair",
        name: "AC Gas Refill",
        description: "AC gas refilling and cooling optimization",
        basePrice: 699,
        duration: 60,
        icon: "💨"
    },
    
    // Pest Control
    {
        category: "Pest Control",
        name: "General Pest Control",
        description: "Complete pest control for common household pests",
        basePrice: 999,
        duration: 120,
        icon: "🐛"
    },
    {
        category: "Pest Control",
        name: "Termite Treatment",
        description: "Professional termite inspection and treatment",
        basePrice: 1999,
        duration: 180,
        icon: "🪲"
    },
    {
        category: "Pest Control",
        name: "Cockroach Control",
        description: "Specialized cockroach elimination service",
        basePrice: 1,
        duration: 90,
        icon: "🪳"
    },
    
    // Appliance Repair
    {
        category: "Appliance Repair",
        name: "Washing Machine Repair",
        description: "Repair all types of washing machines",
        basePrice: 599,
        duration: 90,
        icon: "🧺"
    },
    {
        category: "Appliance Repair",
        name: "Refrigerator Repair",
        description: "Complete refrigerator repair and maintenance",
        basePrice: 799,
        duration: 120,
        icon: "🧊"
    },
    {
        category: "Appliance Repair",
        name: "Microwave Repair",
        description: "Expert microwave oven repair service",
        basePrice: 499,
        duration: 60,
        icon: "📱"
    }
];

const initDB = async () => {
    try {
        await Service.deleteMany({});
        console.log("🗑️  Existing services deleted");
        
        await Service.insertMany(initialServices);
        console.log("✅ Services data initialized successfully");
        console.log(`📊 Total services added: ${initialServices.length}`);
        
        mongoose.connection.close();
    } catch (err) {
        console.error("❌ Error initializing data:", err);
        mongoose.connection.close();
    }
};
