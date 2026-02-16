#!/usr/bin/env node

/**
 * Database Cleanup Script for ServEase
 * 
 * This script removes all user data and bookings while preserving:
 * - Admin account
 * - Service categories
 * 
 * Use this for a fresh start with new users.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const Booking = require('./models/booking');

const ATLASDB_URL = process.env.ATLASDB_URL || 'mongodb://127.0.0.1:27017/serviceBooking';

async function cleanupDatabase() {
    console.log('\n================================================');
    console.log('  ServEase Database Cleanup Tool');
    console.log('================================================\n');

    try {
        // Connect to database
        console.log('📡 Connecting to database...');
        await mongoose.connect(ATLASDB_URL);
        console.log('✅ Connected successfully!\n');

        // Get current stats
        const totalUsers = await User.countDocuments();
        const totalBookings = await Booking.countDocuments();
        
        console.log('📊 Current Database Statistics:');
        console.log(`   Total Users: ${totalUsers}`);
        console.log(`   Total Bookings: ${totalBookings}\n`);

        // Confirm action
        console.log('⚠️  WARNING: This will delete:');
        console.log('   - All user accounts (except admin)');
        console.log('   - All booking records');
        console.log('   - All user login credentials (except admin)\n');
        
        console.log('✅ This will preserve:');
        console.log('   - Admin account');
        console.log('   - All service categories');
        console.log('   - Database structure\n');

        // Delete all bookings
        console.log('🗑️  Removing all bookings...');
        const bookingResult = await Booking.deleteMany({});
        console.log(`✅ Deleted ${bookingResult.deletedCount} bookings\n`);

        // Delete all users except admin
        console.log('🗑️  Removing all users (except admin)...');
        const userResult = await User.deleteMany({ username: { $ne: 'admin' } });
        console.log(`✅ Deleted ${userResult.deletedCount} user accounts\n`);

        // Verify admin still exists
        const adminUser = await User.findOne({ username: 'admin' });
        if (adminUser) {
            console.log('✅ Admin account preserved successfully');
            console.log(`   Username: ${adminUser.username}`);
            console.log(`   Email: ${adminUser.email || 'Not set'}\n`);
        } else {
            console.log('⚠️  WARNING: Admin account not found!');
            console.log('   You may need to create a new admin account.\n');
        }

        // Final stats
        const remainingUsers = await User.countDocuments();
        const remainingBookings = await Booking.countDocuments();

        console.log('================================================');
        console.log('  Cleanup Complete!');
        console.log('================================================\n');
        console.log('📊 Final Statistics:');
        console.log(`   Remaining Users: ${remainingUsers} (should be 1 - admin)`);
        console.log(`   Remaining Bookings: ${remainingBookings} (should be 0)\n`);

        if (remainingUsers === 1 && remainingBookings === 0) {
            console.log('✅ Database cleanup successful!');
            console.log('   Your database is now ready for fresh users.\n');
        } else {
            console.log('⚠️  Some data may still remain. Please verify.\n');
        }

        console.log('📝 Next Steps:');
        console.log('   1. Restart your server: npm start');
        console.log('   2. Users can now register fresh accounts');
        console.log('   3. Admin can login with existing credentials\n');

    } catch (error) {
        console.error('\n❌ Error during cleanup:', error.message);
        console.error('\n💡 Troubleshooting:');
        console.error('   - Ensure MongoDB is running');
        console.error('   - Check your ATLASDB_URL in .env');
        console.error('   - Verify database connection\n');
        process.exit(1);
    } finally {
        // Disconnect from database
        await mongoose.disconnect();
        console.log('👋 Disconnected from database\n');
    }
}

// Run cleanup if executed directly
if (require.main === module) {
    console.log('\n⏳ Starting database cleanup...\n');
    
    // Add a 3-second delay for user to cancel if needed
    console.log('⚠️  LAST CHANCE TO CANCEL: Press Ctrl+C within 3 seconds...\n');
    
    setTimeout(() => {
        cleanupDatabase()
            .then(() => {
                console.log('🎉 Database cleanup completed successfully!\n');
                process.exit(0);
            })
            .catch((error) => {
                console.error('❌ Fatal error:', error);
                process.exit(1);
            });
    }, 3000);
}

module.exports = cleanupDatabase;
