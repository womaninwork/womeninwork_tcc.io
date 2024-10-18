const usuario = require("../models/usuarioModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(12);
const { enviarEmail } = require("../util/email");

const usuarioController = {
 
  regrasValidacaoFormCad: [ 
    body("nome_usu")
          .isLength({ min: 5, max: 35 }).withMessage("O nome de usuário/e-mail deve ter de 5 a 35 caracteres"),
          body("nomeusu_usu")
          .isLength({ min: 8, max: 45 }).withMessage("Nome de usuário deve ter de 8 a 45 caracteres!")
          .custom(async value => {
              const nomeUsu = await usuarioModel.findCampoCustom({ 'user_usuario': value });
              if (nomeUsu > 0) {
                  throw new Error('Nome de usuário em uso!');
              }
          }),
      body("email_usu")
          .isEmail().withMessage("Digite um e-mail válido!")
          .custom(async value => {
              const nomeUsu = await usuarioModel.findCampoCustom({ 'email_usuario': value });
              if (nomeUsu > 0) {
                  throw new Error('E-mail em uso!');
              }
          }),
      body("senha_usu")
          .isStrongPassword()
          .withMessage("A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)")
  ],
      

  logar: (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
        return res.render("pages/login", { listaErros: erros, dadosNotificacao: null })
    }
    if (req.session.autenticado.autenticado != null) {
        res.redirect("/");
    } else {
        res.render("pages/login", {
            listaErros: null,
            dadosNotificacao: { titulo: "Falha ao logar!", mensagem: "Usuário e/ou senha inválidos!", tipo: "error" }
        })
    }
},
 
 
  cadastrar: (req, res) => {
    const erros = validationResult(req);
    var dadosForm = {
        user_usuario: req.body.nomeusu_usu,
        senha_usuario: bcrypt.hashSync(req.body.senha_usu, salt),
        nome_usuario: req.body.nome_usu,
        email_usuario: req.body.email_usu,
    };
    if (!erros.isEmpty()) {
        return res.render("pages/cadastro", { listaErros: erros, dadosNotificacao: null, valores: req.body })
    }
    try {
        let create = usuario.create(dadosForm);
        res.render("pages/cadastro", {
            listaErros: null, dadosNotificacao: {
                titulo: "Cadastro realizado!", mensagem: "Novo usuário criado com sucesso!", tipo: "success"
            }, valores: req.body
        })
    } catch (e) {
        console.log(e);
        res.render("pages/cadastro", {
            listaErros: erros, dadosNotificacao: {
                titulo: "Erro ao cadastrar!", mensagem: "Verifique os valores digitados!", tipo: "error"
            }, valores: req.body
        })
    }
}
}
 
module.exports = usuarioController
