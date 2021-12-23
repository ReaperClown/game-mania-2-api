const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const Admin = require("../models/adminModel");
const MASTER_KEY = process.env.MASTER_KEY;
const { registerValidation, loginValidation } = require("../middleware/validation");


// registro
exports.signUp = async (req, res, next) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExist = await Admin.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Este email já existe.");

  try {
    const newAdmin = await createAdmin(req);
    const savedAdmin = await newAdmin.save(); 
    return res.status(200).send({ message: "Usuário criado com sucesso!", user: savedAdmin  });
  } catch (error) {
    return res.status(400).send(error);
  }
};

// login
exports.logIn = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const foundAdmin = await Admin.findOne({ email: req.body.email }); //retorna o primeiro documento que corresponde aos critérios de consulta ou null
  if (!foundAdmin) return res.status(400).send({ message: "Email não encontrado" });

  try {
    const isMatch = await bcrypt.compareSync(req.body.password, foundAdmin.password);
    if (!isMatch) return res.status(400).send({ message: "Senha inválida" });

    // cria e atribui jwt
    const token = await jwt.sign({ _id: foundAdmin._id }, MASTER_KEY);
    
    return res.status(200).header("admin-token", token).send({ "admin-token": token });
  } catch (error) {
    return res.status(400).send(error);
  }
};
// Atualizar admin
exports.updateAdmin = async (req, res) => {
  try {

    req.body.password = await bcrypt.hashSync(req.body.password, 10); //criptografa a senha antes de salvá-la
    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true });

    if (!updatedAdmin) {
      return res.status(400).send({ message: "Não foi possível atualizar o usuário." });
    }
    return res.status(200).send({ message: "Usuário atualizado com sucesso!", updatedUser});

  } catch (error) {
    return res.status(400).send({ error: "Ocorreu um erro inesperado, não foi possível atualizar o usuário." });
  }
};

// Deletar usuário
exports.deleteAdmin = async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete({ _id: req.params.userId}); // await para garantir a remoção correta e evitar erros

    if (!deletedAdmin) {
      return res.status(400).send({ message: "Não foi possível remover o usuário." });
    }
    return res.status(200).send({ message: "Usuário removido com sucesso.", user: deletedAdmin});
  } catch (error) {
    return res.status(400).send({ error: "Ocorreu um erro inesperado, não foi possível remover o usuário." });
  }
};

exports.data = async (req, res) => {
  return res.json({
    posts: {
      title: "Autenticação de Administrador",
      discription: "Dados que só podem ser vistos devido à autenticação",
    },
  });
};

async function createAdmin(req) {
  const hashPassword = await bcrypt.hashSync(req.body.password, 10);
  return new Admin({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashPassword,
    phone: req.body.phone,
  });
}