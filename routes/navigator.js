var express = require("express");
var router = express.Router();
var Company = require("../models/company");
var moment = require('moment');

// Требующиеся модули контроллеров.
const comp_controller = require("../controllers/companyController");
const prod_controller = require("../controllers/productController");

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

// GET catalog home page.
router.get("/", async function(req, res, next) {
    const companies = await Company.find({})
            .populate({ path: 'products', model: 'ProductModel' })
            .sort({ date_created: 1 })
            .exec();
    
    if (req.user) {
        var userdata = { authorized: true, name: req.user.username };
    } else {
        var userdata = { authorized: false, name: ''};
    }
    res.render('navigator', { companies: companies, moment: moment, user: userdata });
});

router.get("/my_companies", isLoggedIn, comp_controller.company_list);
router.post("/my_companies/create", isLoggedIn, comp_controller.company_create_post);
router.get("/my_companies/:id/delete", isLoggedIn, comp_controller.company_delete_get);

router.post("/my_companies/:id/create_product", isLoggedIn, prod_controller.product_create_post);
router.get("/my_companies/delete_product/:id", isLoggedIn, prod_controller.product_delete_get);

module.exports = router;