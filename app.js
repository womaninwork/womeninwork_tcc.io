const express = require("express");
const app = express();
const env = require("dotenv").config();
const port = process.env.APP_PORT;
const { body, validationResult } = require('express-validator');


var session = require("express-session");
app.use(
  session({
    secret: "HELLo nODE",
    resave: false,
    saveUninitialized: false,
}));
app.use(express.static("app/public"));
 
app.set("view engine", "ejs");
app.set("views", "./app/views");
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
var router = require("./app/routes/router");
app.use("/", router);
app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}\nhttp://localhost:${port}`);
});
