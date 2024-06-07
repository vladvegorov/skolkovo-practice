var Company = require("../models/company");
var moment = require('moment');

// Показать список всех авторов.
exports.company_list = async function (req, res) {
    if (req.isAuthenticated()) {
        const companies = await Company.find({ owner: req.user })
            .populate({ path: 'products', model: 'ProductModel' })
            .sort({ date_created: 1 })
            .exec();
    
        var userdata = { authorized: true, name: req.user.username };
        res.render('my_companies', { user: userdata, companies: companies });
    } else {
        var userdata = { authorized: false, name: ''};
        res.redirect('/');
    }   
};

// Создать автора по запросу POST.
exports.company_create_post = async function (req, res) {
    const data = req.body;
    var errors = '';
    if (!String(data.name).trim()) {
	errors = errors + 'Введите название, ';
    }
    if (!String(data.inn).trim()) {
	errors = errors + 'Введите ИНН, ';
    }

    if (!moment(data.date_created, "YYYY-MM-DD").isValid()){
        errors = errors + 'Введите корректную дату';
    };
    
    if (errors.length > 0) {
	res.status(400).send({ message: "Ошибки в форме: " + errors });
    } else {
        const company = await Company.create({
            name: data.name,
            creation_date: data.date_created,
            INN: data.inn,
            owner: req.user
        });

        res.redirect("/navigator/my_companies");
    }
};

// Удалить автора по запросу POST.
exports.company_delete_get = async function (req, res) {
    if (req.params.id) {
        const company = await Company.findById(req.params.id);
        if (company.owner._id.toString() === req.user._id.toString()) {
            await company.deleteOne();
        }
    }
    res.redirect("/navigator/my_companies");
};

