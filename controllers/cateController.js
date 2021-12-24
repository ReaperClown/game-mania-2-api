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

exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete({ _id: req.params.categId }); // await para garantir a remoção correta e evitar erros

    if (!deletedCategory) {
      return res.status(400).send({ message: "Não foi possível remover a categoria." });
    }
    return res.status(200).send({ message: "Categoria removida com sucesso.", category: deletedCategory });
  } catch (error) {
    return res.status(400).send({ error: "Ocorreu um erro inesperado, não foi possível remover a categoria." });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(req.params.categId, { $set: req.body }, { new: true });

    if (!updatedCategory) {
      return res.status(400).send({ message: "Não foi possível atualizar a categoria." });
    }
    return res.status(200).send({ message: "Categoria atualizada com sucesso!", updatedCategory });

  } catch (error) {
    return res.status(400).send({ error: "Ocorreu um erro inesperado, não foi possível atualizar a categoria." });
  }
};