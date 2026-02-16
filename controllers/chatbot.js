const Booking = require("../models/booking");
const Service = require("../models/service");
const moment = require("moment");

/**
 * Enhanced Intent Detection with better Hinglish support
 */
const detectIntent = (message) => {
    const msg = message.toLowerCase().trim();
    
    // Service booking intents with more keywords
    const intents = {
        cleaning: {
            keywords: ['ghar saaf', 'safai', 'cleaning', 'clean', 'saaf karo', 'karwani', 'full cleaning', 
                       'deep cleaning', 'kitchen clean', 'saaf', 'ghar ki safai', 'kamra saaf'],
            serviceCategory: 'Cleaning',
            serviceName: 'Full House Cleaning',
            hinglish: 'safai'
        },
        plumbing: {
            keywords: ['tap', 'nal', 'plumbing', 'pipe', 'leakage', 'bathroom', 'toilet', 'drain', 
                       'paani', 'water', 'nal theek', 'plumber chahiye', 'paani ka masla'],
            serviceCategory: 'Plumbing',
            serviceName: 'Tap Repair',
            hinglish: 'nal ka kaam'
        },
        electrician: {
            keywords: ['bijli', 'light', 'fan', 'switch', 'wiring', 'electrical', 'electrician', 'bulb',
                       'pankha', 'bijli ka kaam', 'switch repair', 'electrician chahiye'],
            serviceCategory: 'Electrician',
            serviceName: 'Wiring & Installation',
            hinglish: 'bijli ka kaam'
        },
        ac: {
            keywords: ['ac', 'air conditioner', 'cooling', 'thanda', 'ac repair', 'ac service',
                       'ac theek karo', 'ac nahi chal raha'],
            serviceCategory: 'AC Repair',
            serviceName: 'AC Service',
            hinglish: 'AC'
        },
        pest: {
            keywords: ['kida', 'makoda', 'pest', 'cockroach', 'termite', 'insect', 'bugs',
                       'cockroach control', 'kide mare'],
            serviceCategory: 'Pest Control',
            serviceName: 'General Pest Control',
            hinglish: 'kida control'
        },
        cooking: {
            keywords: ['khana', 'cooking', 'cook', 'food', 'meal', 'tiffin', 'rasoi',
                       'khana banana', 'cook chahiye', 'rasoi ka kaam'],
            serviceCategory: 'Cooking',
            serviceName: 'Daily Meal Cooking',
            hinglish: 'khana banana'
        }
    };
    
    // Check for service booking intent
    for (const [key, intent] of Object.entries(intents)) {
        for (const keyword of intent.keywords) {
            if (msg.includes(keyword)) {
                return {
                    type: 'service_booking',
                    category: intent.serviceCategory,
                    serviceName: intent.serviceName,
                    serviceKey: key,
                    hinglish: intent.hinglish
                };
            }
        }
    }
    
    // Show services intent
    if (msg.includes('show') || msg.includes('list') || msg.includes('services') || 
        msg.includes('dekho') || msg.includes('dikhao') || msg.includes('batao') ||
        msg.includes('kya hai') || msg.includes('available') || msg.includes('milta')) {
        return { type: 'show_services' };
    }
    
    // My bookings intent
    if (msg.includes('my booking') || msg.includes('bookings') || msg.includes('meri booking') ||
        msg.includes('history') || msg.includes('orders') || msg.includes('mera order')) {
        return { type: 'my_bookings' };
    }
    
    // Contact support intent
    if (msg.includes('contact') || msg.includes('support') || msg.includes('help') ||
        msg.includes('call') || msg.includes('phone') || msg.includes('sampark') || 
        msg.includes('baat karna') || msg.includes('help chahiye')) {
        return { type: 'contact_support' };
    }
    
    // Greetings
    if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey') ||
        msg.includes('namaste') || msg.includes('namaskar') || msg.includes('kaise ho')) {
        return { type: 'greeting' };
    }
    
    // Default - didn't understand
    return { type: 'unknown' };
};

/**
 * Process chatbot message and generate response
 */
module.exports.processMessage = async (req, res) => {
    try {
        const { message, context } = req.body;
        const user = req.user;
        
        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }
        
        console.log("🤖 Chatbot received:", message);
        console.log("📝 Context:", context);
        
        let response = {};
        
        // Handle conversation context (multi-step booking)
        if (context && context.step) {
            response = await handleConversationContext(message, context, user);
        } else {
            // Detect intent for new conversation
            const intent = detectIntent(message);
            console.log("🎯 Detected intent:", intent.type);
            
            switch (intent.type) {
                case 'greeting':
                    response = {
                        type: 'greeting',
                        text: user 
                            ? `Namaste ${user.username || 'sir/ma\'am'}! 👋\n\nMain aapki kaise madad kar sakta hoon?\n\nKya aap koi service book karna chahte hain?`
                            : `Namaste! 👋\n\nMain aapki kaise madad kar sakta hoon?\n\nServices dekhne ke liye: "services dikhao"\nBooking ke liye: "ghar ki safai karwani hai"`,
                        buttons: user 
                            ? ['Services Dikhao', 'Meri Bookings', 'Contact Support']
                            : ['Services Dikhao', 'Login Karo', 'Contact Support']
                    };
                    break;
                    
                case 'service_booking':
                    if (!user) {
                        response = {
                            type: 'login_required',
                            text: "🔐 Service book karne ke liye pehle login karna padega.\n\nKripya login karein ya nayi account banayein.",
                            action: 'redirect_login',
                            buttons: ['Login', 'Sign Up']
                        };
                    } else {
                        // Find services in that category
                        const services = await Service.find({ 
                            category: intent.category,
                            isActive: true 
                        }).limit(5);
                        
                        if (services.length > 0) {
                            const serviceList = services.map(s => ({
                                id: s._id,
                                name: s.name,
                                price: s.basePrice,
                                icon: s.icon,
                                duration: s.duration
                            }));
                            
                            response = {
                                type: 'service_options',
                                text: `✅ ${intent.category} ke liye yeh services available hain:\n\nKaunsi service chahiye?`,
                                services: serviceList,
                                context: {
                                    step: 'service_selection',
                                    category: intent.category
                                }
                            };
                        } else {
                            response = {
                                type: 'not_found',
                                text: `😕 Sorry, ${intent.category} category mein abhi koi service available nahi hai.\n\nAap dusri services dekh sakte hain.`,
                                buttons: ['All Services Dikhao', 'Contact Support']
                            };
                        }
                    }
                    break;
                    
                case 'show_services':
                    const allServices = await Service.find({ isActive: true })
                        .select('name category basePrice icon duration');
                    
                    const servicesByCategory = {};
                    allServices.forEach(s => {
                        if (!servicesByCategory[s.category]) {
                            servicesByCategory[s.category] = [];
                        }
                        servicesByCategory[s.category].push({
                            id: s._id,
                            name: s.name,
                            price: s.basePrice,
                            icon: s.icon,
                            duration: s.duration
                        });
                    });
                    
                    response = {
                        type: 'service_list',
                        text: `📋 Yeh humari services hain:\n\nKoi bhi service book karne ke liye uska naam bataiye!`,
                        servicesByCategory: servicesByCategory,
                        buttons: ['Book Karo', 'Contact Support']
                    };
                    break;
                    
                case 'my_bookings':
                    if (!user) {
                        response = {
                            type: 'login_required',
                            text: "🔐 Apni bookings dekhne ke liye pehle login karna padega.",
                            action: 'redirect_login',
                            buttons: ['Login', 'Sign Up']
                        };
                    } else {
                        const bookings = await Booking.find({ user: user._id })
                            .populate('service')
                            .sort({ createdAt: -1 })
                            .limit(5);
                        
                        if (bookings.length > 0) {
                            const bookingList = bookings.map(b => ({
                                id: b._id,
                                bookingId: b.bookingId,
                                serviceName: b.service ? b.service.name : 'Service Unavailable',
                                serviceIcon: b.service ? b.service.icon : '🔧',
                                status: b.status,
                                date: b.scheduledDate,
                                time: b.scheduledTime,
                                price: b.totalPrice
                            }));
                            
                            response = {
                                type: 'bookings_list',
                                text: `📋 Aapki recent bookings:\n\n`,
                                bookings: bookingList,
                                buttons: ['View All Bookings', 'Book New Service']
                            };
                        } else {
                            response = {
                                type: 'no_bookings',
                                text: "📭 Abhi tak koi booking nahi hai.\n\nKya aap koi service book karna chahte hain?\n\nTry: 'ghar ki safai' ya 'services dikhao'",
                                buttons: ['Book Service', 'Show Services']
                            };
                        }
                    }
                    break;
                    
                case 'contact_support':
                    response = {
                        type: 'contact',
                        text: "📞 Aap humse yahan contact kar sakte hain:\n\n📱 Phone: +91 98765 43210\n📧 Email: support@servease.com\n⏰ Timing: 9 AM - 9 PM (Mon-Sat)\n\nKya aur koi madad chahiye?",
                        buttons: ['Services Dikhao', 'Meri Bookings']
                    };
                    break;
                    
                default:
                    response = {
                        type: 'unknown',
                        text: "❓ Main samajh nahi paya.\n\nAap yeh try kar sakte hain:\n\n✅ 'ghar ki safai karwani hai'\n✅ 'services dikhao'\n✅ 'meri bookings'\n✅ 'contact support'",
                        buttons: ['Show Services', 'Book Cleaning', 'My Bookings']
                    };
            }
        }
        
        console.log("📤 Sending response:", JSON.stringify(response, null, 2));
        
        res.json({
            success: true,
            response
        });
    } catch (error) {
        console.error("❌ Chatbot error:", error);
        res.status(500).json({
            success: false,
            message: "Chatbot error occurred",
            response: {
                type: 'error',
                text: "😕 Kuch galat ho gaya. Kripya phir se try karein.",
                buttons: ['Show Services', 'Contact Support']
            }
        });
    }
};

/**
 * Handle multi-step conversation context
 */
async function handleConversationContext(message, context, user) {
    const msg = message.toLowerCase().trim();
    
    switch (context.step) {
        case 'service_selection':
            // User selected a service, now ask for confirmation
            if (msg.includes('cancel') || msg.includes('nahi') || msg.includes('back')) {
                return {
                    type: 'cancelled',
                    text: "Thik hai! Koi baat nahi.\n\nKya aur kuch madad chahiye?",
                    buttons: ['Services Dikhao', 'Meri Bookings'],
                    context: null
                };
            }
            
            // If user says yes/confirm/haan
            if (msg.includes('yes') || msg.includes('confirm') || msg.includes('haan') || 
                msg.includes('book') || msg.includes('karo')) {
                return {
                    type: 'ask_details',
                    text: "✅ Badhiya!\n\n📅 Kab service chahiye?\n📍 Address kya hai?\n\nAap booking form fill kar sakte hain:",
                    action: 'open_booking_form',
                    buttons: ['Book Now', 'Cancel']
                };
            }
            
            return {
                type: 'confirm_service',
                text: "Kya aap is service ko book karna chahte hain?\n\n📅 Date aur time select karein\n📍 Address confirm karein",
                buttons: ['Haan, Book Karo', 'Nahi, Cancel Karo'],
                context: context
            };
            
        default:
            return {
                type: 'unknown',
                text: "Main samajh nahi paya. Kya aap service book karna chahte hain?",
                buttons: ['Services Dikhao', 'Contact Support']
            };
    }
}

/**
 * Quick book service from chatbot
 */
module.exports.quickBook = async (req, res) => {
    try {
        const { serviceId } = req.body;
        const user = req.user;
        
        if (!user) {
            return res.json({
                success: false,
                message: "Please login first",
                action: 'redirect_login'
            });
        }
        
        if (!serviceId) {
            return res.json({
                success: false,
                message: "Service ID is required"
            });
        }
        
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.json({
                success: false,
                message: "Service not found"
            });
        }
        
        // Check if user has address
        if (!user.address || !user.address.street || !user.address.city || !user.address.pincode) {
            return res.json({
                success: false,
                message: "Please add your address first",
                action: 'add_address'
            });
        }
        
        // Create booking with default date/time (today + 2 hours)
        const now = moment();
        const scheduledDate = now.format('YYYY-MM-DD');
        const scheduledTime = now.add(2, 'hours').format('HH:mm');
        const estimatedArrivalTime = moment(`${scheduledDate} ${scheduledTime}`, 'YYYY-MM-DD HH:mm')
            .add(15, 'minutes')
            .format('hh:mm A');
        
        const newBooking = new Booking({
            user: user._id,
            service: serviceId,
            scheduledDate,
            scheduledTime,
            address: user.address,
            totalPrice: service.basePrice,
            estimatedArrivalTime,
            status: "Pending"
        });
        
        await newBooking.save();
        
        res.json({
            success: true,
            booking: {
                bookingId: newBooking.bookingId,
                service: service.name,
                date: moment(scheduledDate).format('DD/MM/YYYY'),
                time: scheduledTime,
                eta: estimatedArrivalTime,
                price: service.basePrice
            }
        });
    } catch (error) {
        console.error("❌ Quick book error:", error);
        res.json({
            success: false,
            message: "Failed to create booking"
        });
    }
};

module.exports.handleConversationContext = handleConversationContext;
