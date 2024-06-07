//Требуется Mongoose
var mongoose = require("mongoose");

//Определяем схему
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name: { type: String, required: true },
    company: {type: mongoose.Types.ObjectId, ref: "CompanyModel", required: true },
    description: { type: String, required: true },
    price: Number
});

//экспортируется функция для создания класса модели "SomeModel"
module.exports = mongoose.model("ProductModel", ProductSchema);
