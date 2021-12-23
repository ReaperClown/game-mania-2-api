const Category = require("../models/cateModel");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

exports.createCategory = async (req, res, next) => {
  const dbCategory = await Category.findOne({ name: req.body.name });
  if (dbCategory) return res.status(400).send("Está categoria já existe.");

  const newCategory = new Category({ name: req.body.name });

  newCategory.save((error, savedCategory) => {
    if (error) return res.status(400).send("Ocorreu um erro inesperado.", error);
    return res.status(200).send({ message: "Categoria criada com sucesso!", category: savedCategory });
  });
};

exports.getCategories = (req, res, next) => {
  Category.find({}, "name createdAt _id",(error, categories) => {
    if (error) return res.status(400).send("Ocorreu um erro inesperado.", error);
    return res.status(200).send({ message: "Mostrando lista de categorias", count: categories.length, categories, });
  });
};

