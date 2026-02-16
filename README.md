# 🌟 ServEase - Instant Home Service Booking Platform

<div align="center">

![ServEase Banner](https://img.shields.io/badge/ServEase-Service%20Booking-FF1654?style=for-the-badge&logo=homeadvisor&logoColor=white)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-43853d?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**_Your trusted platform for instant home service bookings with 15-minute guaranteed arrival time!_**

[Features](#-features) • [Installation](#-quick-start) • [Configuration](#-configuration) • [Usage](#-usage) • [API](#-razorpay-integration)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [Razorpay Integration](#-razorpay-integration)
- [Database Management](#-database-management)
- [Project Structure](#-project-structure)
- [Admin Features](#-admin-features)
- [User Guide](#-user-guide)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 🎯 Overview

**ServEase** is a modern, full-featured home service booking platform designed to connect users with service providers instantly. Built with Node.js, Express, and MongoDB, it offers a seamless experience for booking household services like cleaning, plumbing, electrical work, cooking, and more.

### 🌟 Key Highlights

- **⚡ Instant Booking**: Book services in seconds with our streamlined process
- **⏱️ 15-Minute ETA**: Guaranteed service provider arrival within 15 minutes
- **💳 Flexible Payments**: Cash on Service or Online Payment via Razorpay
- **📱 Fully Responsive**: Beautiful UI that works on all devices
- **🔐 Secure Authentication**: Industry-standard authentication with Passport.js
- **📊 Admin Dashboard**: Complete service and booking management system
- **🤖 AI Chatbot**: Intelligent chatbot for instant customer support

---

## ✨ Features

### 🎨 User Features

#### 🔑 Authentication & Profile
- **Secure Registration**: Create account with email, phone, and address
- **Login System**: Secure authentication with session management
- **Profile Management**: Auto-fill addresses from saved profile
- **Beautiful Auth Pages**: Modern, animated login/signup interfaces with smooth transitions

#### 🏠 Service Booking
- **10 Service Categories**: 
  - 🧹 House Cleaning
  - 🔧 Plumbing Services
  - ⚡ Electrical Work
  - 👨‍🍳 Cooking Services
  - 🎨 Painting Services
  - 🌱 Gardening
  - 💆 Beauty Services
  - 🧑‍🔧 AC Repair
  - 🚗 Car Washing
  - 👶 Babysitting

- **Instant Booking Flow**:
  1. Select service category
  2. Choose date and time
  3. Enter service address
  4. Add special instructions (optional)
  5. Select payment method
  6. Confirm booking

- **Smart Features**:
  - Address auto-fill from user profile
  - Real-time price calculation
  - Estimated arrival time display (15 minutes)
  - Unique booking ID for tracking
  - Booking confirmation messages

#### 📜 Booking Management
- **Booking History**: View all past and current bookings
- **Status Tracking**: Real-time booking status updates
  - 🕒 Pending
  - ✅ Confirmed
  - 🚀 In Progress
  - ✔️ Completed
  - ❌ Cancelled

- **Rating & Reviews**: Rate completed services (1-5 stars) with written reviews
- **Booking Cancellation**: Cancel pending or confirmed bookings
- **Detailed View**: Full booking information with service provider details

#### 💳 Payment Options
- **Cash on Service**: Traditional payment method
- **Online Payment**: Secure Razorpay integration
  - Credit/Debit Cards
  - UPI
  - Net Banking
  - Wallets

### 👨‍💼 Admin Features

#### 📊 Dashboard
- **Booking Overview**: Real-time statistics and analytics
- **Service Management**: Add, edit, or remove services
- **User Management**: View and manage user accounts
- **Booking Management**: Update booking statuses

#### 🤖 AI Chatbot
- **Intelligent Responses**: AI-powered customer support
- **24/7 Availability**: Always ready to help
- **Common Queries**: Handles FAQs automatically
- **Booking Assistance**: Helps users with the booking process

#### 📈 Analytics
- **Revenue Tracking**: Monitor earnings and payments
- **Service Analytics**: Most booked services and categories
- **User Statistics**: Active users and growth metrics
- **Booking Trends**: Daily, weekly, and monthly trends

---

## 🛠️ Technology Stack

### Backend
```
Node.js (v18+)          - JavaScript runtime
Express.js (v4.18)      - Web application framework
MongoDB (v8.0)          - NoSQL database
Mongoose (v8.0)         - MongoDB ODM
```

### Authentication & Security
```
Passport.js             - Authentication middleware
Passport-Local          - Local authentication strategy
Passport-Local-Mongoose - User authentication plugin
Express-Session         - Session management
Connect-Mongo           - MongoDB session store
```

### Frontend
```
EJS (v3.1)              - Templating engine
Bootstrap 5             - CSS framework
Font Awesome 6          - Icon library
Custom CSS              - Enhanced styling with animations
```

### Payment Gateway
```
Razorpay SDK (v2.9)     - Payment processing
```

### Utilities
```
Moment.js (v2.29)       - Date/time handling
Dotenv (v16.3)          - Environment configuration
Method-Override (v3.0)  - HTTP method support
Connect-Flash (v0.1)    - Flash messages
Joi (v17.11)            - Data validation
```

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v7 or higher) - [Download](https://www.mongodb.com/try/download/community) OR use MongoDB Atlas
- **npm** (comes with Node.js)

### Installation Steps

1. **Extract the Project**
   ```bash
   cd ServEase_Updated
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   ```bash
   # Copy the example .env file
   cp .env.example .env
   
   # Edit .env with your settings
   nano .env  # or use any text editor
   ```

4. **Seed the Database** (First time only)
   ```bash
   # Initialize services
   node init/seedServices.js
   
   # Create admin account
   node createAdmin.js
   ```

5. **Start the Server**
   ```bash
   # Production mode
   npm start
   
   # Development mode (with auto-restart)
   npm run dev
   ```

6. **Access the Application**
   ```
   Open your browser and navigate to: http://localhost:8080
   ```

### Default Admin Credentials
```
Username: admin
Password: admin123
```
⚠️ **Important**: Change these credentials immediately after first login!

---

## ⚙️ Configuration

### Environment Variables (.env)

```env
# Database Configuration
ATLASDB_URL=mongodb://127.0.0.1:27017/serviceBooking
# For MongoDB Atlas (cloud):
# ATLASDB_URL=mongodb+srv://username:password@cluster.mongodb.net/serviceBooking

# Session Secret (Change this to a random string)
SECRET=your_super_secret_key_here_change_this

# Server Port
PORT=8080

# Razorpay Configuration (Get from: https://dashboard.razorpay.com/app/keys)
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

### Database Options

#### Option 1: Local MongoDB
```env
ATLASDB_URL=mongodb://127.0.0.1:27017/serviceBooking
```

#### Option 2: MongoDB Atlas (Cloud)
1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Replace in .env:
```env
ATLASDB_URL=mongodb+srv://username:password@cluster.mongodb.net/serviceBooking
```

---

## 💳 Razorpay Integration

### Setup Instructions

1. **Get Razorpay Account**
   - Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Complete KYC verification
   - Switch to **Test Mode** for testing

2. **Get API Keys**
   - Navigate to Settings → API Keys
   - Generate new keys
   - Copy `Key ID` and `Key Secret`

3. **Configure Environment**
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
   ```

4. **Activate Payment Integration**
   ```bash
   # Run the activation script
   bash activate_payment.sh
   ```
   
   This script will:
   - ✅ Backup existing files
   - ✅ Replace with payment-enabled versions
   - ✅ Update routes, controllers, and views

5. **Restart Server**
   ```bash
   npm start
   ```

### Testing Payments

Use Razorpay's test cards:
```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
```

### Payment Flow
1. User selects "Online Payment" during booking
2. Razorpay payment modal opens
3. User completes payment
4. Booking confirmed automatically
5. Payment status tracked in database

---

## 🗄️ Database Management

### Fresh Start (Reset Database)

To start with a clean database (removes all users except admin):

```bash
# Run the cleanup script
node reset-database.js
```

This script will:
- ✅ Remove all user accounts (except admin)
- ✅ Delete all bookings
- ✅ Keep service categories intact
- ✅ Preserve admin account

### Manual Database Reset

```javascript
// Connect to MongoDB
mongosh

// Switch to database
use serviceBooking

// Remove all bookings
db.bookings.deleteMany({})

// Remove all users except admin
db.users.deleteMany({ username: { $ne: "admin" } })

// Verify
db.users.countDocuments()
db.bookings.countDocuments()
```

### Backup Database

```bash
# Local MongoDB
mongodump --db=serviceBooking --out=./backup/$(date +%Y%m%d)

# MongoDB Atlas
mongodump --uri="mongodb+srv://..." --out=./backup/$(date +%Y%m%d)
```

---

## 📁 Project Structure

```
ServEase_Updated/
│
├── 📂 models/                  # Database models
│   ├── user.js                 # User model with authentication
│   ├── service.js              # Service categories model
│   └── booking.js              # Booking model with payment info
│
├── 📂 controllers/             # Business logic
│   ├── users.js                # Authentication controllers
│   ├── services.js             # Service listing & details
│   ├── bookings.js             # Basic booking operations
│   ├── bookings_updated.js     # With Razorpay integration
│   ├── admin.js                # Admin panel controllers
│   └── chatbot.js              # AI chatbot logic
│
├── 📂 routes/                  # API routes
│   ├── user.js                 # User authentication routes
│   ├── service.js              # Service routes
│   ├── booking.js              # Basic booking routes
│   ├── booking_updated.js      # With payment routes
│   ├── admin.js                # Admin routes
│   └── chatbot.js              # Chatbot routes
│
├── 📂 views/                   # EJS templates
│   ├── 📂 layouts/
│   │   └── boilerplate.ejs     # Main layout template
│   ├── 📂 includes/
│   │   ├── navbar.ejs          # Navigation bar
│   │   ├── flash.ejs           # Flash messages
│   │   └── footer.ejs          # Footer component
│   ├── 📂 users/
│   │   ├── signup.ejs          # Enhanced signup page
│   │   └── login.ejs           # Enhanced login page
│   ├── 📂 services/
│   │   ├── index.ejs           # Service listing
│   │   └── show.ejs            # Service details
│   ├── 📂 bookings/
│   │   ├── new.ejs             # Basic booking form
│   │   ├── new_updated.ejs     # With payment options
│   │   ├── show.ejs            # Booking details
│   │   └── history.ejs         # User booking history
│   └── 📂 admin/
│       ├── dashboard.ejs       # Admin dashboard
│       ├── bookings.ejs        # Booking management
│       └── chatbot.ejs         # Chatbot interface
│
├── 📂 public/                  # Static files
│   ├── 📂 css/
│   │   ├── style.css           # Main stylesheet
│   │   └── chatbot.css         # Chatbot styling
│   ├── 📂 js/
│   │   └── script.js           # Client-side JavaScript
│   └── 📂 assets/
│       └── images/             # Images and icons
│
├── 📂 init/                    # Database initialization
│   └── seedServices.js         # Service seeding script
│
├── 📂 utils/                   # Utility functions
│   ├── ExpressError.js         # Custom error handling
│   └── wrapAsync.js            # Async wrapper
│
├── 📄 app.js                   # Main application file
├── 📄 middleware.js            # Custom middleware
├── 📄 createAdmin.js           # Admin creation script
├── 📄 reset-database.js        # Database cleanup script
├── 📄 activate_payment.sh      # Payment activation script
├── 📄 package.json             # Dependencies
├── 📄 .env                     # Environment variables (don't commit!)
├── 📄 .env.example             # Environment template
└── 📄 README.md                # This file
```

---

## 👨‍💼 Admin Features

### Access Admin Panel

1. Login with admin credentials
2. Navigate to: `http://localhost:8080/admin`

### Dashboard Features

#### 📊 Statistics Overview
- Total bookings count
- Revenue summary
- Active users count
- Service performance metrics

#### 🔧 Service Management
- Add new service categories
- Edit existing services
- Update pricing
- Set service descriptions
- Manage service availability

#### 📝 Booking Management
- View all bookings
- Update booking status:
  - Pending → Confirmed
  - Confirmed → In Progress
  - In Progress → Completed
  - Cancel bookings
- Assign service providers
- View customer details
- Track payment status

#### 🤖 Chatbot Configuration
- Configure AI responses
- Update FAQ database
- Monitor chat analytics
- Train bot with new queries

---

## 📱 User Guide

### Creating an Account

1. Click "Sign Up" in navigation
2. Fill in required details:
   - Username (unique)
   - Email address
   - Phone number
   - Password
   - Address (optional, but recommended for quick booking)
3. Click "Sign Up"
4. Login with your credentials

### Booking a Service

1. **Browse Services**
   - View all service categories on homepage
   - Click on desired service for details

2. **Select Service**
   - View service description and pricing
   - Click "Book Now"

3. **Fill Booking Details**
   - Select date and time
   - Enter or confirm service address
   - Add special instructions (optional)
   - Choose payment method

4. **Confirm Booking**
   - Review all details
   - Click "Confirm Booking"
   - Save your unique Booking ID

5. **Track Booking**
   - Go to "My Bookings"
   - View real-time status updates
   - See estimated arrival time

### Rating a Service

1. Go to "My Bookings"
2. Find completed booking
3. Click "Rate Service"
4. Select star rating (1-5)
5. Write review (optional)
6. Submit feedback

---

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```bash
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: 
- Start MongoDB service: `mongod` (or `brew services start mongodb-community` on Mac)
- Check if MongoDB is running: `mongosh`

#### Port Already in Use
```bash
Error: listen EADDRINUSE: address already in use :::8080
```
**Solution**:
- Change PORT in .env to a different port (e.g., 3000, 5000)
- Or kill the process using port 8080:
  ```bash
  # Linux/Mac
  lsof -ti:8080 | xargs kill -9
  
  # Windows
  netstat -ano | findstr :8080
  taskkill /PID <PID> /F
  ```

#### Razorpay Integration Not Working
**Solution**:
1. Verify API keys are correct in .env
2. Run: `bash activate_payment.sh`
3. Restart server: `npm start`
4. Clear browser cache

#### Session Expired Issues
**Solution**:
- Update SECRET in .env with a long random string
- Clear browser cookies
- Restart server

#### Database Seeding Fails
**Solution**:
```bash
# Drop existing database
mongosh
use serviceBooking
db.dropDatabase()

# Re-run seeding
node init/seedServices.js
node createAdmin.js
```

---

## 🎨 UI/UX Highlights

### Design Features

- **Modern Gradient Themes**: Eye-catching pink/red gradient scheme
- **Smooth Animations**: CSS animations for all interactions
- **Card-based Layout**: Clean, organized content presentation
- **Responsive Design**: Perfect on mobile, tablet, and desktop
- **Beautiful Auth Pages**: Login/Signup with smooth transitions and hover effects:
  - Animated card hover effects
  - Color shadow transitions
  - Gradient headers with pattern animations
  - Smooth input focus effects
  - Ripple button animations
  - Floating label animations

### Color Palette
```css
Primary: #FF1654     (Vibrant Pink)
Dark:    #7C0B3D     (Deep Crimson)
Secondary: #FF5C8D   (Soft Pink)
Accent:  #FF8FB1     (Light Pink)
Success: #00C853     (Green)
```

---

## 🔐 Security Features

- **Password Hashing**: Using Passport-Local-Mongoose
- **Session Management**: Secure cookie-based sessions
- **CSRF Protection**: Form validation and sanitization
- **Input Validation**: Server-side validation with Joi
- **XSS Prevention**: EJS auto-escaping
- **Secure Payment**: PCI-compliant Razorpay integration

---

## 📈 Performance

- **Fast Page Load**: Optimized assets and caching
- **Database Indexing**: Optimized queries
- **Session Store**: MongoDB for persistent sessions
- **Lazy Loading**: Images loaded on demand
- **Minified Assets**: Compressed CSS/JS

---

## 🚀 Deployment

### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create servease-app

# Set environment variables
heroku config:set ATLASDB_URL="your_mongodb_atlas_url"
heroku config:set SECRET="your_secret_key"
heroku config:set RAZORPAY_KEY_ID="your_key_id"
heroku config:set RAZORPAY_KEY_SECRET="your_key_secret"

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# Open app
heroku open
```

### Deploy to Render/Railway

1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Project Lead**: Service Booking Team
- **Frontend**: UI/UX Design Team
- **Backend**: API Development Team
- **Database**: Data Architecture Team

---

## 📞 Support

Need help? Reach out to us:

- **Email**: support@servease.com
- **Website**: [www.servease.com](https://www.servease.com)
- **Issues**: [GitHub Issues](https://github.com/yourrepo/servease/issues)

---

## 🎉 Acknowledgments

- Bootstrap team for the amazing CSS framework
- Font Awesome for beautiful icons
- MongoDB team for excellent documentation
- Razorpay for seamless payment integration
- Node.js and Express.js communities

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Made with ❤️ by the ServEase Team**

[![GitHub](https://img.shields.io/github/stars/yourrepo/servease?style=social)](https://github.com/yourrepo/servease)

</div>
