const Service = require("../models/service");

module.exports.index = async (req, res) => {
    const services = await Service.find({ isActive: true });
    
    // Group services by category
    const groupedServices = {};
    services.forEach(service => {
        if (!groupedServices[service.category]) {
            groupedServices[service.category] = [];
        }
        groupedServices[service.category].push(service);
    });
    
    res.render("services/index.ejs", { groupedServices });
};

module.exports.showService = async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (!service) {
        req.flash("error", "Service not found!");
        return res.redirect("/services");
    }
    res.render("services/show.ejs", { service });
};
