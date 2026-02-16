const mongoose = require("mongoose");
const User = require("./models/user");
require("dotenv").config();

const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/serviceBooking";

async function createAdmin() {
    try {
        await mongoose.connect(dbUrl);
        console.log("✅ Connected to database");
        
        // Check if admin already exists
        const existingAdmin = await User.findOne({ 
            $or: [{ username: "admin" }, { email: "admin@servease.com" }]
        });
        if (existingAdmin) {
            console.log("⚠️  Admin user already exists!");
            console.log("Username: admin");
            console.log("Email: admin@servease.com");
            console.log("If you forgot password, delete this user and run again.");
            mongoose.connection.close();
            return;
        }
        
        // Create admin user
        const admin = new User({
            username: "admin",  // Required by passport-local-mongoose
            email: "admin@servease.com",
            phone: "9999999999",
            role: "admin",
            address: {
                street: "Admin Office",
                city: "Mumbai",
                state: "Maharashtra",
                pincode: "400001"
            }
        });
        
        await User.register(admin, "admin123");
        
        console.log("\n🎉 Admin user created successfully!\n");
        console.log("================================");
        console.log("👤 Username: admin");
        console.log("📧 Email: admin@servease.com");
        console.log("🔑 Password: admin123");
        console.log("================================\n");
        console.log("Login at: http://localhost:8080/login");
        console.log("Use username: admin (or email: admin@servease.com)");
        console.log("Then visit: http://localhost:8080/admin/dashboard\n");
        
        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error creating admin:", error.message);
        mongoose.connection.close();
    }
}

createAdmin();
