var Product = require("../models/product");
var Company = require("../models/company");

// Создать автора по запросу POST.
exports.product_create_post = async function (req, res) {
    const data = req.body;
    var errors = '';
    if (!String(data.name).trim()) {
	errors = errors + 'Введите название, ';
    }
    if (!String(data.description).trim()) {
	errors = errors + 'Введите описание, ';
    }

    if (data.price < 0){
        errors = errors + 'Введите корректную цену';
    };
    
    const company = await Company.findById(req.params.id);
    if (company) {
        if (company.owner._id.toString() !== req.user._id.toString()) {
            errors = errors + ' Выберите свою компанию';
        }
    } else {
        errors = errors + ' Укажите компанию';
    }
    
    if (errors.length > 0) {
	res.status(400).send({ message: "Ошибки в форме: " + errors });
    } else {
        const product = await Product.create({
            name: data.name,
            description: data.description,
            company: company,
            price: data.price
        });

        res.redirect("/navigator/my_companies");
    }
};

// Удалить автора по запросу POST.
exports.product_delete_get = async function (req, res) {
    if (req.params.id) {
        const product = await Product.findById(req.params.id);
        if (product) {
            const company = await Company.findById(product.company);
            if (company) {
                if (company.owner._id.toString() === req.user._id.toString()) {
                    await product.deleteOne();
                }
            }
        }
    }
    res.redirect("/navigator/my_companies");
};

