/**
 * ServEase Chatbot - AI-Powered Service Booking Assistant
 * Production-ready chatbot with intent detection and auto-booking
 */

class ServEaseChatBot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.currentServiceId = null;
        this.initializeElements();
        this.attachEventListeners();
        this.addWelcomeMessage();
        console.log('🤖 ServEase ChatBot initialized');
    }

    initializeElements() {
        this.toggle = document.getElementById('chatbotToggle');
        this.panel = document.getElementById('chatbotPanel');
        this.close = document.getElementById('chatbotClose');
        this.messagesContainer = document.getElementById('chatbotMessages');
        this.input = document.getElementById('chatbotInput');
        this.sendBtn = document.getElementById('chatbotSend');
        this.typingIndicator = document.getElementById('typingIndicator');
    }

    attachEventListeners() {
        this.toggle?.addEventListener('click', () => this.toggleChat());
        this.close?.addEventListener('click', () => this.toggleChat());
        this.sendBtn?.addEventListener('click', () => this.sendMessage());
        
        this.input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-focus input when chat opens
        if (this.panel) {
            this.panel.addEventListener('transitionend', () => {
                if (this.isOpen) this.input?.focus();
            });
        }
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.panel?.classList.toggle('active');
        
        if (this.isOpen) {
            this.input?.focus();
            console.log('💬 Chat opened');
        } else {
            console.log('❌ Chat closed');
        }
    }

    addWelcomeMessage() {
        const welcomeMsg = {
            type: 'bot',
            text: `👋 **Hello! I'm ServEase Bot**

I can help you with:
• 🛠️ Book services instantly
• 📋 Check your bookings  
• 📞 Contact support
• 💡 Get service recommendations

Try: "book cleaning" or "show services"`,
            buttons: ['Book Cleaning', 'Show Services', 'My Bookings'],
            isWelcome: true
        };
        this.addMessage(welcomeMsg);
    }

    addMessage(message) {
        this.messages.push(message);
        this.renderMessage(message);
        this.scrollToBottom();
    }

    renderMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.type}${message.isWelcome ? ' welcome' : ''}`;
        
        let html = '';
        
        // Avatar
        if (message.type === 'bot') {
            html += '<div class="message-avatar">🤖</div>';
        }
        
        // Message content
        html += `<div class="message-content">`;
        
        // Format text (markdown-like)
        let formattedText = message.text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/•/g, '<span style="color: var(--primary-color);">•</span>');
        
        html += formattedText;
        
        // Quick action buttons
        if (message.buttons && message.buttons.length > 0) {
            html += '<div class="quick-buttons">';
            message.buttons.forEach(btn => {
                html += `<button class="quick-btn" onclick="chatbot.handleQuickAction('${btn}')">${btn}</button>`;
            });
            html += '</div>';
        }
        
        // Service confirmation
        if (message.service) {
            this.currentServiceId = message.service.id;
            html += `
                <div class="service-card-chat mt-3">
                    <strong>${message.service.name}</strong><br>
                    <small>Category: ${message.service.category}</small><br>
                    <strong style="color: var(--primary-color);">₹${message.service.price}</strong>
                    <div class="mt-2">
                        <button class="btn btn-sm btn-primary" onclick="chatbot.confirmBooking()">
                            ✅ Confirm Booking
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="chatbot.handleQuickAction('Show Services')">
                            ❌ Cancel
                        </button>
                    </div>
                </div>
            `;
        }
        
        // Booking list
        if (message.bookings && message.bookings.length > 0) {
            html += '<div class="mt-2">';
            message.bookings.forEach(b => {
                const statusColor = {
                    'Pending': 'warning',
                    'Accepted': 'primary',
                    'In Progress': 'info',
                    'Completed': 'success',
                    'Cancelled': 'danger'
                }[b.status] || 'secondary';
                
                html += `
                    <div class="alert alert-light mb-2 p-2">
                        <small>
                            ${b.icon} <strong>${b.service}</strong><br>
                            📅 ${b.date} | <span class="badge bg-${statusColor}">${b.status}</span><br>
                            🆔 ${b.bookingId}
                        </small>
                    </div>
                `;
            });
            html += '</div>';
        }
        
        // Service categories OR service list
        if (message.services) {
            html += '<div class="mt-2">';
            
            // Check if services is an array (service list) or object (categorized)
            if (Array.isArray(message.services)) {
                // Service list from chatbot
                message.services.forEach(s => {
                    html += `
                        <div class="service-option mb-2" style="border: 1px solid #ddd; padding: 10px; border-radius: 8px; cursor: pointer;" 
                             onclick="chatbot.selectService('${s.id}', '${s.name}', ${s.price})">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <span style="font-size: 1.5rem;">${s.icon}</span>
                                    <strong>${s.name}</strong>
                                    <br><small>Duration: ${s.duration} mins</small>
                                </div>
                                <div>
                                    <strong style="color: var(--primary-color);">₹${s.price}</strong>
                                </div>
                            </div>
                        </div>
                    `;
                });
            } else {
                // Categorized services (old format)
                for (const [category, services] of Object.entries(message.services)) {
                    html += `<div class="mb-2"><strong>${category}:</strong><br>`;
                    services.forEach(s => {
                        html += `<span class="badge bg-light text-dark me-1 mb-1">${s.icon} ${s.name} (₹${s.price})</span> `;
                    });
                    html += '</div>';
                }
            }
            
            html += '</div>';
        }
        
        html += '</div>'; // Close message-content
        messageDiv.innerHTML = html;
        this.messagesContainer.appendChild(messageDiv);
    }

    handleQuickAction(action) {
        console.log('🎯 Quick action:', action);
        this.input.value = action;
        this.sendMessage();
    }

    selectService(serviceId, serviceName, price) {
        console.log('🎯 Service selected:', serviceId, serviceName);
        this.currentServiceId = serviceId;
        
        // Show confirmation message
        this.addMessage({
            type: 'bot',
            text: `✅ Badhiya! Aapne select kiya: **${serviceName}** (₹${price})\n\n📋 Booking confirm karne ke liye "Confirm" button dabayein.`,
            service: {
                id: serviceId,
                name: serviceName,
                price: price
            }
        });
    }

    async sendMessage() {
        const text = this.input.value.trim();
        if (!text) return;
        
        console.log('💬 Sending:', text);
        
        // Add user message
        this.addMessage({
            type: 'user',
            text: text
        });
        
        this.input.value = '';
        this.showTyping();
        
        try {
            const response = await fetch('/chatbot/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: text })
            });
            
            const data = await response.json();
            this.hideTyping();
            
            if (data.success) {
                console.log('✅ Bot response:', data.response.type);
                this.addMessage({
                    type: 'bot',
                    ...data.response
                });
                
                // Handle special actions
                if (data.response.action === 'redirect_login') {
                    setTimeout(() => {
                        if (confirm('You need to login first. Redirect to login page?')) {
                            window.location.href = '/login';
                        }
                    }, 1500);
                }
            } else {
                this.addMessage({
                    type: 'bot',
                    text: '⚠️ Sorry, something went wrong. Please try again.',
                    buttons: ['Show Services']
                });
            }
        } catch (error) {
            console.error('❌ Chatbot error:', error);
            this.hideTyping();
            this.addMessage({
                type: 'bot',
                text: '⚠️ Connection error. Please check your internet and try again.',
                buttons: ['Try Again']
            });
        }
    }

    async confirmBooking() {
        if (!this.currentServiceId) {
            alert('Service not selected');
            return;
        }
        
        console.log('🎫 Confirming booking for service:', this.currentServiceId);
        this.showTyping();
        
        try {
            const response = await fetch('/chatbot/quick-book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ serviceId: this.currentServiceId })
            });
            
            const data = await response.json();
            this.hideTyping();
            
            if (data.success) {
                console.log('✅ Booking created:', data.booking.bookingId);
                
                this.addMessage({
                    type: 'bot',
                    text: `✅ **Booking Confirmed Successfully!**

🆔 Booking ID: **${data.booking.bookingId}**
🛠️ Service: ${data.booking.service}
📅 Date: ${data.booking.date}
⏰ Time: ${data.booking.time}
🚀 Estimated Arrival: **${data.booking.eta}**
💰 Price: **₹${data.booking.price}**

Your service provider will arrive within **15 minutes** of scheduled time!`,
                    buttons: ['My Bookings', 'Book Another Service']
                });
                
                this.currentServiceId = null;
            } else {
                console.error('❌ Booking failed:', data.message);
                
                let errorMsg = `❌ ${data.message}`;
                let buttons = ['Try Again'];
                
                if (data.action === 'add_address') {
                    errorMsg += '\n\nPlease add your address in your profile first.';
                    buttons = ['Go to Profile', 'Show Services'];
                }
                
                this.addMessage({
                    type: 'bot',
                    text: errorMsg,
                    buttons: buttons
                });
            }
        } catch (error) {
            console.error('❌ Booking error:', error);
            this.hideTyping();
            this.addMessage({
                type: 'bot',
                text: '⚠️ Failed to create booking. Please try booking from the main page.',
                buttons: ['Go to Services']
            });
        }
    }

    showTyping() {
        this.typingIndicator?.classList.add('active');
        this.scrollToBottom();
    }

    hideTyping() {
        this.typingIndicator?.classList.remove('active');
    }

    scrollToBottom() {
        setTimeout(() => {
            if (this.messagesContainer) {
                this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
            }
        }, 100);
    }

    // Clear chat history
    clearChat() {
        this.messages = [];
        while (this.messagesContainer.firstChild) {
            this.messagesContainer.removeChild(this.messagesContainer.firstChild);
        }
        this.addWelcomeMessage();
        console.log('🗑️ Chat cleared');
    }
}

// Initialize chatbot when DOM is ready
let chatbot;
document.addEventListener('DOMContentLoaded', () => {
    chatbot = new ServEaseChatBot();
    console.log('✅ Chatbot ready');
});

// Keyboard shortcut to open chatbot (Ctrl+K or Cmd+K)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (chatbot && !chatbot.isOpen) {
            chatbot.toggleChat();
        }
    }
});
