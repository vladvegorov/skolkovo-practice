const Product = require("./models/product");
const Company = require("./models/company");

const companies = [];
const products = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = "mongodb://localhost:27017/navigator";

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCompanies();
  await createProducts();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function createCompany(index, comp_name, date, inn) {
  const companydetail = { name: comp_name, creation_date: date, INN: inn };

  const company = new Company(companydetail);

  await company.save();
  companies[index] = company;
  console.log(`Added company: ${comp_name} ${inn}`);
}

async function createProduct(index, prod_name, comp, desc, price) {
  const productdetail = {
    name: prod_name,
    company: comp,
    description: desc,
    price: price
  };

  const product = new Product(productdetail);
  await product.save();
  products[index] = product;
  console.log(`Added product: ${prod_name}`);
}

async function createCompanies() {
  console.log("Adding products");
  await Promise.all([
    createCompany(0, "Рапид био", "2020-06-06", '0326576671'),
    createCompany(1, "ДРД", "2015-10-11", '0326524916')
  ]);
}

async function createProducts() {
  console.log("Adding companies");
  await Promise.all([
    createProduct(0, "Экспресс-тесты для диагностики COVID-19", companies[0], "Экспресс-тесты для диагностики COVID-19", 800),
    createProduct(0, "Экспресс-тесты для диагностики HIV", companies[0], "Экспресс-тесты для диагностики HIV", 1200),
    createProduct(0, "Экспресс-тесты для диагностики гриппа А/В", companies[0], "Экспресс-тесты для диагностики гриппа A/B", 400),
    createProduct(0, "ИХА-тесты для диагностики инсульта", companies[1], "ИХА-тесты для диагностики инсульта", 1500),
    createProduct(0, "ИФА-тесты для диагностики ЧМТ", companies[1], "ИФА-тесты для диагностики ЧМТ", 750)
  ]);
}
