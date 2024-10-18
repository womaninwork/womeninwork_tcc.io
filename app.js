const express = require("express");
const app = express();
const env = require("dotenv").config();
const port = process.env.APP_PORT;
 
 
app.use(express.static("app/public"));
 
app.set("view engine", "ejs");
app.set("views", "./app/views");
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
var rotas = require("./app/routes/router");
app.use("/", rotas);
 
app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}\nhttp://localhost:${port}`);
});
