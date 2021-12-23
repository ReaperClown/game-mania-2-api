const mongoose = require("mongoose");

const database = mongoose.connect(
  process.env.DB_URL,
  { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false,
    useCreateIndex: true
  },
  (error) => {
    if (!error) {
      console.log("conectado ao mongoDB");
    } else {
      console.log("falha na conexão com o mongoDB \n" + error);
    }
  }
);

module.exports = database;
