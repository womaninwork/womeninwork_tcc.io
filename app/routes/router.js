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
  
  router.get("/cadastro", function (req, res) {
    res.render("pages/cadastro", {
      listaErros: null,
      dadosNotificacao: null,
      valores: { nome_usu: "", nomeusu_usu: "", email_usu: "", senha_usu: "" },
    });
  });
  
  router.post(
    "/cadastro",
    usuarioController.regrasValidacaoFormCad,
    async function (req, res) {
      usuarioController.cadastrar(req, res);
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
  router.get("/index", function (req, res) {
    res.render("pages/index", { pagina: "index", logado: null });
});
 
router.get("/cursos", function (req, res) {
    res.render("pages/cursos", { pagina: "cursos", logado: null });
});

router.get("/sobrenos", function (req, res) {
    res.render("pages/sobrenos", { pagina: "sobrenos", logado: null });
});

router.post("/cadastro",
    usuarioController.regrasValidacaoFormCad,
    async function (req, res) {
        usuarioController.cadastrar(req, res);
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
      
      router.get("/cadastro", function (req, res) {
        res.render("pages/cadastro", {
          listaErros: null,
          dadosNotificacao: null,
          valores: { nome_usu: "", nomeusu_usu: "", email_usu: "", senha_usu: "" },
        });
      });
      
      router.post(
        "/cadastro",
        usuarioController.regrasValidacaoFormCad,
        async function (req, res) {
          usuarioController.cadastrar(req, res);
        }
      );
      
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