//Требуется Mongoose
var mongoose = require("mongoose");

//Определяем схему
var Schema = mongoose.Schema;

var CompanySchema = new Schema({
    owner: {type: mongoose.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    creation_date: Date,
    INN: { type: String, required: true }
});

CompanySchema.virtual('products', {
  ref: 'ProductModel',
  localField: '_id',
  foreignField: 'company'
});

//экспортируется функция для создания класса модели "SomeModel"
module.exports = mongoose.model("CompanyModel", CompanySchema);
