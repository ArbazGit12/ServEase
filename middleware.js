module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be logged in to access this page");
        return res.redirect("/login");
    }
    next();
};

module.exports.isAdmin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    if (req.user.role !== "admin") {
        req.flash("error", "Access denied. Admin privileges required.");
        return res.redirect("/services");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.redirectUrl = req.session.returnTo;
    }
    next();
};

module.exports.validateBooking = (req, res, next) => {
    const { service, scheduledDate, scheduledTime, address } = req.body;
    
    if (!service || !scheduledDate || !scheduledTime) {
        req.flash("error", "Please fill all required fields");
        return res.redirect("/services");
    }
    
    if (!address || !address.street || !address.city || !address.pincode) {
        req.flash("error", "Please provide complete address");
        return res.redirect("/services");
    }
    
    next();
};
