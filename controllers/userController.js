const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const User = require("../models/userModel");
const { registerValidation, loginValidation } = require("../middleware/validation");
const JWT_KEY = process.env.JWT_KEY;


// signup
exports.signUp = async (req, res, next) => {
  const { error, value } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExist = await User.findOne({ email: req.body.email }); //retorna o primeiro documento que corresponde aos critérios de consulta ou null
  if (emailExist) return res.status(400).send({ message: "Este email já existe." });

  try {
    const newUser = await createUserObj(req);
    const savedUser = await User.create(newUser);
    return res.status(200).send({ message: "Usuário criado com sucesso!", user: savedUser });
  } catch (err) {
    return res.status(400).send({ error: "Usuário criado com sucesso!", error: err });
  }
};

// login
exports.logIn = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const foundUser = await User.findOne({ email: req.body.email }); //retorna o primeiro documento que corresponde aos critérios de consulta ou null
  if (!foundUser) return res.status(400).send({ message: "Credenciais de login incorretas" });

  try {
    const isMatch = await bcrypt.compareSync(req.body.password, foundUser.password);
    if (!isMatch) return res.status(400).send({ message: "Credenciais de login incorretas" });

    // create and assign jwt
    const token = await jwt.sign({ _id: foundUser._id }, JWT_KEY);

    return res.status(200).header("auth-token", token).send({ "auth-token": token, userId: foundUser._id });
  } catch (error) {
    return res.status(400).send(error);
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10); //criptografa a senha antes de salvá-la
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true });

    if (!updatedUser) {
      return res.status(400).send({ message: "Não foi possível atualizar o usuário." });
    }
    return res.status(200).send({ message: "Usuário atualizado com sucesso!", updatedUser });

  } catch (error) {
    return res.status(400).send({ error: "Ocorreu um erro inesperado, não foi possível atualizar o usuário." });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId); // await para garantir a remoção correta e evitar erros

    if (!deletedUser) {
      return res.status(400).send({ message: "Não foi possível remover o usuário." });
    }
    return res.status(200).send({ message: "Usuário removido com sucesso.", user: deletedUser });
  } catch (error) {
    return res.status(400).send({ error: "Ocorreu um erro inesperado, não foi possível remover o usuário." });
  }
};

exports.data = async (req, res) => {
  return res.json({
    posts: {
      title: "Autenticação de Usuário",
      description: "Dados que só podem ser vistos devido à autenticação",
    },
  });
};

const createUserObj = async (req) => {
  return {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
  };
}
