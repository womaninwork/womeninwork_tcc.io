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
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 dia (em milissegundos)
      httpOnly: true,              // Protege contra ataques de script
      secure: false,               // Defina como `true` se usar HTTPS
    },
  }));
app.use(express.static("app/public"));

app.set("view engine", "ejs");
app.set("views", "./app/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var router = require("./app/routes/router");
app.use("/", router);

app.post('/register', (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  // Inserir o usuário no banco de dados
  pool.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [nome, email, senha],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Erro ao registrar o usuário.');
      }
      res.json({ message: 'Usuário registrado com sucesso!', redirectTo: '/users' });
    }
  );
});

app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');

    // Enviar os dados como JSON
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).send('Erro ao buscar usuários.');
  }
});



app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}\nhttp://localhost:${port}`);
});
