#!/bin/bash

# ServEase Payment Integration Activation Script
# This script activates the payment integration by replacing the old files with new ones

echo "================================================"
echo "  ServEase Payment Integration Activation"
echo "================================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

echo "✅ Found package.json - we're in the right directory"
echo ""

# Create backup directory
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "📦 Created backup directory: $BACKUP_DIR"
echo ""

# Function to backup and replace files
replace_file() {
    local old_file=$1
    local new_file=$2
    local backup_name=$3
    
    if [ -f "$old_file" ]; then
        echo "  📋 Backing up: $old_file"
        cp "$old_file" "$BACKUP_DIR/$backup_name"
        
        if [ -f "$new_file" ]; then
            echo "  ➡️  Replacing with: $new_file"
            cp "$new_file" "$old_file"
            echo "  ✅ Success!"
        else
            echo "  ❌ Error: $new_file not found!"
            return 1
        fi
    else
        if [ -f "$new_file" ]; then
            echo "  ➕ Creating new file: $old_file"
            cp "$new_file" "$old_file"
            echo "  ✅ Success!"
        else
            echo "  ❌ Error: Neither $old_file nor $new_file found!"
            return 1
        fi
    fi
    echo ""
}

echo "🔄 Starting file replacement..."
echo ""

# Replace routes
echo "1️⃣  Updating routes..."
replace_file "routes/booking.js" "routes/booking_updated.js" "booking.js.backup"

# Replace controllers
echo "2️⃣  Updating controllers..."
replace_file "controllers/bookings.js" "controllers/bookings_updated.js" "bookings.js.backup"

# Replace views
echo "3️⃣  Updating views..."
replace_file "views/bookings/new.ejs" "views/bookings/new_updated.ejs" "new.ejs.backup"

echo "================================================"
echo "✅ Activation Complete!"
echo "================================================"
echo ""
echo "📝 Next Steps:"
echo "1. Configure Razorpay keys in .env file"
echo "   RAZORPAY_KEY_ID=your_key_id"
echo "   RAZORPAY_KEY_SECRET=your_key_secret"
echo ""
echo "2. Install dependencies:"
echo "   npm install"
echo ""
echo "3. Restart your server:"
echo "   npm start"
echo ""
echo "📦 Backup files saved in: $BACKUP_DIR"
echo ""
echo "📖 For detailed instructions, see:"
echo "   - IMPLEMENTATION_GUIDE.md"
echo "   - PAYMENT_SETUP_GUIDE.md"
echo "   - README_UPDATES.md"
echo ""
echo "🎉 Happy coding!"
