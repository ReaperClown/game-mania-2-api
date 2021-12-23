const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");

const categoryRoute = require("./routes/cateRoute");
const productRoute = require("./routes/prodRoute");
const cartRoute = require("./routes/cartRoute");
const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");
const swaggerDocument = require("./swagger.json");

// Use body parser middleware to parse body of incoming requests
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Rotas que lidarão com as requisições
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // <-- Documentação da API
app.use("/product", productRoute);
app.use("/category", categoryRoute);
app.use("/cart", cartRoute);
app.use("/admin", adminRoute);
app.use("/user", userRoute);

app.get("/", (req, res) => {
  res.send('A API ESTÁ OPERANDO, acesse "/docs" pela url raiz para a documentação da API');
});

// Tratamento de erros
app.use((req, res, next) => {
  const error = new Error();
  error.message = "Não Encontrado";
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({ error: error });
});

module.exports = app;
