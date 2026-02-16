// Form Validation
(function() {
    'use strict';
    
    // Fetch all forms that need validation
    const forms = document.querySelectorAll('.needs-validation');
    
    // Loop over them and prevent submission if invalid
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
})();

// Navbar Scroll Effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Service Search Functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('serviceSearch');
    
    if (searchInput) {
        // Add keyup event for better responsiveness
        searchInput.addEventListener('keyup', function(e) {
            performSearch(e.target.value);
        });
        
        // Also add input event as backup
        searchInput.addEventListener('input', function(e) {
            performSearch(e.target.value);
        });
    }
    
    function performSearch(searchTerm) {
        searchTerm = searchTerm.toLowerCase().trim();
        const serviceCards = document.querySelectorAll('.service-item');
        const categorySections = document.querySelectorAll('.category-section');
        
        // If search is empty, show all
        if (!searchTerm) {
            serviceCards.forEach(card => card.style.display = 'block');
            categorySections.forEach(section => section.style.display = 'block');
            removeNoResultsMessage();
            return;
        }
        
        let hasVisibleCards = false;
        
        categorySections.forEach(section => {
            let sectionHasVisible = false;
            const cardsInSection = section.querySelectorAll('.service-item');
            
            cardsInSection.forEach(card => {
                const serviceName = card.querySelector('.card-title').textContent.toLowerCase();
                const serviceDesc = card.querySelector('.card-text').textContent.toLowerCase();
                const category = card.dataset.category.toLowerCase();
                
                if (serviceName.includes(searchTerm) || 
                    serviceDesc.includes(searchTerm) || 
                    category.includes(searchTerm)) {
                    card.style.display = 'block';
                    sectionHasVisible = true;
                    hasVisibleCards = true;
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Show/hide section based on visible cards
            section.style.display = sectionHasVisible ? 'block' : 'none';
        });
        
        // Show "no results" message if needed
        if (!hasVisibleCards) {
            showNoResultsMessage();
        } else {
            removeNoResultsMessage();
        }
    }
    
    function showNoResultsMessage() {
        let noResultsMsg = document.getElementById('noResultsMessage');
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'noResultsMessage';
            noResultsMsg.className = 'alert alert-info text-center my-5';
            noResultsMsg.style.animation = 'fadeInUp 0.5s ease';
            noResultsMsg.innerHTML = `
                <i class="fas fa-search fa-3x mb-3" style="color: var(--primary-color);"></i>
                <h4>No services found</h4>
                <p class="mb-0">Try different keywords or browse all services</p>
            `;
            const servicesSection = document.querySelector('.services-section');
            if (servicesSection) {
                servicesSection.insertBefore(noResultsMsg, servicesSection.firstChild);
            }
        }
        noResultsMsg.style.display = 'block';
    }
    
    function removeNoResultsMessage() {
        const noResultsMsg = document.getElementById('noResultsMessage');
        if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }
});

// Auto-dismiss alerts after 5 seconds
document.addEventListener('DOMContentLoaded', function() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
});

// Confirmation dialogs
function confirmAction(message) {
    return confirm(message || 'Are you sure you want to proceed?');
}

// Date and Time Validation
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('scheduledDate');
    const timeInput = document.getElementById('scheduledTime');
    
    if (dateInput && timeInput) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        // Validate time for today's date
        dateInput.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);
            
            if (selectedDate.getTime() === todayDate.getTime()) {
                const now = new Date();
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                timeInput.min = `${hours}:${minutes}`;
            } else {
                timeInput.removeAttribute('min');
            }
        });
    }
});

// Calculate and display estimated arrival time
function calculateArrivalTime() {
    const dateInput = document.getElementById('scheduledDate');
    const timeInput = document.getElementById('scheduledTime');
    const arrivalDisplay = document.getElementById('arrivalTimeDisplay');
    
    if (dateInput && timeInput && dateInput.value && timeInput.value) {
        const scheduledDateTime = new Date(`${dateInput.value}T${timeInput.value}`);
        scheduledDateTime.setMinutes(scheduledDateTime.getMinutes() + 15);
        
        const hours = scheduledDateTime.getHours();
        const minutes = String(scheduledDateTime.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        
        if (arrivalDisplay) {
            arrivalDisplay.textContent = `${displayHours}:${minutes} ${ampm}`;
        }
    }
}

// Attach to date/time inputs if they exist
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('scheduledDate');
    const timeInput = document.getElementById('scheduledTime');
    
    if (dateInput) dateInput.addEventListener('change', calculateArrivalTime);
    if (timeInput) timeInput.addEventListener('change', calculateArrivalTime);
});

// Star rating interaction
document.addEventListener('DOMContentLoaded', function() {
    const ratingInputs = document.querySelectorAll('.rating-stars input[type="radio"]');
    
    ratingInputs.forEach(input => {
        input.addEventListener('change', function() {
            console.log('Rating selected:', this.value);
        });
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Service search/filter (can be enhanced)
function filterServices(category) {
    const allServices = document.querySelectorAll('.service-card');
    
    allServices.forEach(service => {
        if (category === 'all' || service.dataset.category === category) {
            service.style.display = 'block';
        } else {
            service.style.display = 'none';
        }
    });
}

// Print booking details
function printBooking() {
    window.print();
}
