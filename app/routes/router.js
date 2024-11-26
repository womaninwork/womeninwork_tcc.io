const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs")
const upload = require("../helpers/storage")
// const usuarioController = require("../controllers/usuarioController");
const pool = require('../../config/pool_conexoes');
const {
  verificarUsuAutenticado,
  limparSessao,
  gravarUsuAutenticado,
  verificarUsuAutorizado,
} = require("../models/autenticador_middleware");

const { usuarioController } = require("../controllers/usuarioController");
const { carrinhoController } = require("../controllers/carrinhoController");
const { hqController } = require("../controllers/hqController");
const { body } = require('express-validator');


const uploadFile = require("../util/uploader")("./app/public/imagem/perfil/");
// const uploadFile = require("../util/uploader")();
const perfilController = require("../controllers/perfilController");

// SDK do Mercado Pago
const { MercadoPagoConfig, Preference } = require('mercadopago');
const { pedidoController } = require("../controllers/pedidoController");
const usuarioModel = require("../models/usuarioModel");
// Adicione as credenciais
const client = new MercadoPagoConfig({
  accessToken: process.env.accessToken
});
router.get("/addItem", function (req, res) {
  carrinhoController.addItem(req, res);
});

router.get("/removeItem", function (req, res) {
  carrinhoController.removeItem(req, res);
});

router.get("/excluirItem", function (req, res) {
  carrinhoController.excluirItem(req, res);
});

router.get("/listar-carrinho", function (req, res) {
  carrinhoController.listarcarrinho(req, res);
});
router.get(
  "/perfil",
  verificarUsuAutorizado([1, 2, 3], "pages/restrito"),
  async function (req, res) {
    usuarioController.mostrarPerfil(req, res);
  }
);

router.post(
  "/perfil",
  uploadFile("imagem-perfil_usu"),
  usuarioController.regrasValidacaoPerfil,
  verificarUsuAutorizado([1, 2, 3], "pages/restrito"),
  async function (req, res) {
    usuarioController.gravarPerfil(req, res);
  }
);
router.get("/", verificarUsuAutenticado, function (req, res) {
  res.render("pages/index", {
    autenticado: req.session.autenticado,
    login: req.session.logado,
    dadosNotificacao: null
  });
});

router.get("/sair", limparSessao, function (req, res) {
  res.redirect("/");
});

router.get("/login", function (req, res) {
  res.render("pages/login", { listaErros: null, dadosNotificacao: null });
});


router.get("/cursosAPI", async function (req, res) {
  const cursos = await usuarioModel.findAllCursos()
  return res.json({ cursos: cursos })
});


router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Verifica se os campos foram preenchidos
    if ((email == undefined && senha == undefined) || ((email == "" || email == " ") && (senha == "" || senha == " "))) {
      return res.status(400).json({ message: "Email e senha são obrigatórios" });
    }

    // Busca o usuário no banco de dados
    const [rows] = await pool.query("SELECT * FROM usuario WHERE email_usuario = ? LIMIT 1", [email]);
    // Verifica se o usuário existe
    if (rows.length == 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const user = rows[0];
    // Verifica se o campo senha existe no usuário
    if (!user.senha_usuario) {
      return res.status(500).json({ message: "Senha do usuário não encontrada" });
    }

    // Verifica se a senha está correta
    const passwordMatch = bcrypt.compareSync(senha, user.senha_usuario);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    // Cria uma sessão para o usuário
    req.session.userid = user.id_usuario;
    req.session.nome = user.nome_usuario; // Salvando o nome do usuário
    req.session.email = user.email_usuario;

    // Salva a sessão e redireciona para a página do perfil
    return req.session.save(() => {
      res.redirect("/perfil_comum");
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro no servidor, tente novamente mais tarde." });
  }
});


router.post("/cadastro", async (req, res) => {

  // Extrai os dados do formulário
  const { nome, sobrenome, email, celular, senha, confirmPassword } = req.body;

  // Verifica se as senhas são iguais
  if (senha !== confirmPassword) {
    return res.render("pages/cadastro", {
      listaErros: [{ msg: "As senhas não coincidem" }],
      valores: req.body // Retorna os dados inseridos pelo usuário
    });
  }

  try {
    // Verifica se o email já está em uso
    const [emailExist] = await pool.query("SELECT id_usuario FROM usuario WHERE email_usuario = ?", [email]);

    if (emailExist.length > 0) {
      return res.render("pages/cadastro", {
        listaErros: [{ msg: "Email já está em uso." }],
        valores: req.body // Retorna os dados inseridos pelo usuário
      });
    }

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10); // Gera um salt
    const hash = await bcrypt.hash(senha, salt); // Criptografa a senha

    // Insere o novo usuário no banco de dados
    await pool.query(
      "INSERT INTO usuario (nome_usuario, sobrenome_usuario, email_usuario, celular_usuario, senha_usuario) VALUES (?, ?, ?, ?, ?)",
      [nome, sobrenome, email, celular, hash]
    );

    // Redireciona o usuário para a página de login
    res.render("pages/cadastro", {
      listaErros: null,
      dadosNotificacao: {
        titulo: "Cadastro realizado!",
        mensagem: "Novo usuário criado com sucesso! Faça o login.",
        tipo: "success"
      },
      valores: {} // Limpa os campos após o sucesso
    });
  } catch (e) {
    console.error(e);
    res.render("pages/cadastro", {
      listaErros: [{ msg: "Ocorreu um erro ao cadastrar. Tente novamente mais tarde." }],
      valores: req.body // Retorna os dados inseridos pelo usuário
    });
  }
});


router.get("/cadastro", (req, res) => {
  // Renderiza a página de cadastro
  res.render("pages/cadastro", {
    listaErros: null,  // Não há erros a serem exibidos inicialmente
    dadosNotificacao: null,  // Não há notificações a serem exibidas
    valores: {
      nome_usu: "",        // Valor inicial para o nome do usuário
      nomeusu_usu: "",     // Valor inicial para o nome de usuário
      email_usu: "",       // Valor inicial para o e-mail
      senha_usu: "",       // Valor inicial para a senha
      celular_usu: "",     // Valor inicial para o celular (se necessário)
      tipo_usuario_id_tipo_usuario: "",  // Valor inicial para o tipo de usuário (se aplicável)
      cursos_id_cursos: "" // Valor inicial para o curso (se aplicável)
    }
  });
});

router.post("/cadastro", async function (req, res) {
  usuarioController.cadastrar(req, res);
}
);

router.post("/cadastroCurso", async function (req, res) {
  usuarioController.cadastrarCurso(req, res);
}
);

router.get("/usuarios", async (req, res) => {
  try {
    // Buscar todos os usuários do banco de dados
    const usuarios = await usuarioController.findAll();

    // Renderizar a página de listagem de usuários
    res.render("pages/usuarios", { usuarios });  // Passa os dados de usuários para o template
  } catch (error) {
    console.error("Erro ao buscar usuários: ", error);
    res.status(500).send("Erro interno do servidor.");
  }
});

router.get(
  "/adm",
  verificarUsuAutenticado,
  verificarUsuAutorizado([2, 3], "pages/restrito"),
  function (req, res) {
    res.render("pages/adm", req.session.autenticado);
  }
);
router.get("/index", function (req, res) {
  res.render("pages/index", { pagina: "index", logado: null });
});

router.get("/cursos", function (req, res) {
  res.render("pages/cursos", { pagina: "cursos", logado: null });
});

router.get("/sobrenos", function (req, res) {
  res.render("pages/sobrenos", { pagina: "sobrenos", logado: null });
});
router.get("/marketing-cursos", function (req, res) {
  res.render("pages/marketing-cursos", { pagina: "marketing-cursos", logado: null });
});

router.get("/marketing-cursos", function (req, res) {
  res.render("pages/marketing-cursos", { pagina: "marketing-cursos", logado: null });
});

router.get("/design_grafico", function (req, res) {
  res.render("pages/design_grafico", { pagina: "design_grafico", logado: null });
});

router.get("/fotografia", function (req, res) {
  res.render("pages/fotografia", { pagina: "fotografia", logado: null });
});

router.get("/pagamento", function (req, res) {
  res.render("pages/pagamento", { pagina: "pagamento", logado: null });
});

router.get("/perfil_comum", async (req, res) => {
  var nome = req.session.nome;
  const id = req.session.userid;

  // Consulta para pegar a imagem
  const [rows] = await pool.query("SELECT * FROM usuario WHERE id_usuario = ? LIMIT 1", [id]);
  if (rows.length > 0) {
    console.log(rows[0].image)
    // Acessar o buffer da imagem diretamente
    const imageBuffer = rows[0].image;

    // Verificar se o buffer existe e converter para Base64
    const imageBase64 = imageBuffer ? imageBuffer.toString('base64') : null;

    // Passar a imagem para o template EJS
    res.render("pages/perfil_comum", {
      pagina: "perfil_comum",
      logado: null,
      nome: nome,
      image: imageBase64,
    });
  } else {
    res.send("Faça login")
  }
});

router.post("/alterImage", upload.single("picture__input"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo enviado.');
  }
  // Acessando o buffer da imagem
  const imageBuffer = req.file.buffer;
  // Fazer algo com o buffer, como salvar no banco de dados
  console.log('Buffer da imagem:', imageBuffer);

  const id = req.session.userid;
  console.log(id)
  await pool.query("UPDATE usuario SET image = ? WHERE id_usuario = ?", [imageBuffer, id])

  res.redirect("/perfil_comum")
})


router.get("/perfil_prof", function (req, res) {
  res.render("pages/perfil_prof", { pagina: "perfil_prof", logado: null });
});

router.get("/home_comum", function (req, res) {
  res.render("pages/home_comum", { pagina: "home_comum", logado: null });
});

router.get("/home_prof", function (req, res) {
  res.render("pages/home_prof", { pagina: "home_prof", logado: null });
});

router.get("/aula", function (req, res) {
  res.render("pages/aula", { pagina: "aula", logado: null });
});

router.get("/curso_logado", function (req, res) {
  res.render("pages/curso_logado", { pagina: "curso_logado", logado: null });
});

router.get("/escolha_user", function (req, res) {
  res.render("pages/escolha_user", { pagina: "escolha_user", logado: null });
});
router.get("/formcursos", function (req, res) {
  res.render("pages/formcursos", { pagina: "formcursos", logado: null });
});

router.get(
  "/perfil",
  verificarUsuAutorizado([1, 2, 3], "pages/restrito"),
  async function (req, res) {
    usuarioController.mostrarPerfil(req, res);
  }
);

router.post(
  "/perfil",
  uploadFile("imagem-perfil_usu"),
  usuarioController.regrasValidacaoPerfil,
  verificarUsuAutorizado([1, 2, 3], "pages/restrito"),
  async function (req, res) {
    usuarioController.gravarPerfil(req, res);
  }
);

router.get("/recuperar-senha", verificarUsuAutenticado, function (req, res) {
  res.render("pages/rec-senha", { listaErros: null, dadosNotificacao: null });
});

router.post("/recuperar-senha",
  verificarUsuAutenticado,
  usuarioController.regrasValidacaoFormRecSenha,
  function (req, res) {
    usuarioController.recuperarSenha(req, res);
  });

router.get("/resetar-senha",
  function (req, res) {
    usuarioController.validarTokenNovaSenha(req, res);
  });

router.post("/reset-senha",
  usuarioController.regrasValidacaoFormNovaSenha,
  function (req, res) {
    usuarioController.resetarSenha(req, res);
  });

router.get("/formulario", function (req, res) {
  res.render("formulario")
});


module.exports = router;