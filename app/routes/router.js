const express = require("express");
const router = express.Router();
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
          dadosNotificacao:null
    });
  });
  
  router.get("/sair", limparSessao, function (req, res) {
    res.redirect("/");
  });
  
  router.get("/login", function (req, res) {
    res.render("pages/login", { listaErros: null, dadosNotificacao: null });
  });
  
  router.post(
    "/login",
    usuarioController.regrasValidacaoFormLogin,
    gravarUsuAutenticado,
    function (req, res) {
      usuarioController.logar(req, res);
    }
  );
  
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

router.get("/perfil_comum", function (req, res) {
  res.render("pages/perfil_comum", { pagina: "perfil_comum", logado: null });
});

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
      
      router.get("/recuperar-senha", verificarUsuAutenticado, function(req, res){
        res.render("pages/rec-senha",{ listaErros: null, dadosNotificacao: null });
      });
      
      router.post("/recuperar-senha",
        verificarUsuAutenticado,
        usuarioController.regrasValidacaoFormRecSenha, 
        function(req, res){
          usuarioController.recuperarSenha(req, res);
      });
      
      router.get("/resetar-senha", 
        function(req, res){
          usuarioController.validarTokenNovaSenha(req, res);
        });
        
      router.post("/reset-senha", 
          usuarioController.regrasValidacaoFormNovaSenha,
          function(req, res){
          usuarioController.resetarSenha(req, res);
      });
        
//banco de dados//
router.get('/tabelas', async (req, res) => {
    try {
        const [results, fields] = await pool.query('SHOW TABLES');
        res.json(results);
    } catch (error) {
        console.error('Erro ao listar as tabelas:', error);
        res.status(500).send('Erro ao listar as tabelas');
    }
  });
      
      
      router.get(
        "/ativar-conta",
        verificarUsuAutenticado,
        async function (req, res) {
          usuarioController.ativarConta(req, res);
        }
      );
      
      
      router.get(
        "/adm",
        verificarUsuAutenticado,
        verificarUsuAutorizado([2, 3], "pages/restrito"),
        function (req, res) {
          res.render("pages/adm", req.session.autenticado);
        }
      );
      
  
  
  module.exports = router;