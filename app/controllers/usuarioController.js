const usuario = require("../models/usuarioModel");
const { body, validationResult } = require("express-validator");
const { criptografarSenha, compararSenha } = require("../util/criptografia");
const { enviarEmail } = require("../util/email");
 
const usuarioController = {
 
    regrasValidacaoFormLogin: [
        body("nome_usu")
            .isLength({ min: 8, max: 45 })
            .withMessage("O nome de usuário/e-mail deve ter de 8 a 45 caracteres"),
        body("senha_usu")
            .isStrongPassword()
            .withMessage("A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)")
    ],

    regrasValidacaoFormCad: [
        body("email_usuario")
          .isLength({ min: 5, max: 35 }).withMessage("O nome de usuário/e-mail deve ter de 5 a 35 caracteres"),
        body("nome_usuario")
          .isLength({ min: 8, max: 45 }).withMessage("Nome de usuário deve ter de 8 a 45 caracteres!")
          .custom(async value => {
            const nomeUsu = await usuario.findCampoCustom({ 'nome_usuario': value });
            if (nomeUsu > 0) {
              throw new Error('Nome de usuário em uso!');
            }
          }),
        body("email_usuario")
          .isEmail().withMessage("Digite um e-mail válido!")
          .custom(async value => {
            const emailUsu = await usuario.findCampoCustom({ 'email_usuario': value });
            if (emailUsu > 0) {
              throw new Error('E-mail em uso!');
            }
          })
      ],
     
  regrasValidacaoPerfil: [
    body("nome_usu")
        .isLength({ min: 3, max: 45 }).withMessage("Nome deve ter de 3 a 45 caracteres!"),
    body("nomeusu_usu")
        .isLength({ min: 8, max: 45 }).withMessage("Nome de usuário deve ter de 8 a 45 caracteres!"),
    body("email_usu")
        .isEmail().withMessage("Digite um e-mail válido!"),
    body("fone_usu")
        .isLength({ min: 12, max: 15 }).withMessage("Digite um telefone válido!"),
    body("cep")
        .isPostalCode('BR').withMessage("Digite um CEP válido!"),
    body("numero")
        .isNumeric().withMessage("Digite um número para o endereço!"),
    verificarUsuAutorizado([1, 2, 3], "pages/restrito"),
],

regrasValidacaoFormRecSenha: [
    body("email_usu")
      .isEmail()
      .withMessage("Digite um e-mail válido!")
      .custom(async (value) => {
        const nomeUsu = await usuario.findCampoCustom({ email_usuario: value });
        if (nomeUsu == 0) {
          throw new Error("E-mail não encontrado");
        }
      }),
],


regrasValidacaoFormNovaSenha: [
    body("senha_usu")
      .isStrongPassword()
      .withMessage(
        "A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)"
      )
      .custom(async (value, { req }) => {
        if (value !== req.body.csenha_usu) {
          throw new Error("As senhas não são iguais!");
        }
      }),
    body("csenha_usu")
      .isStrongPassword()
      .withMessage(
        "A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)"
      ),
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
 
cadastrar: async (req, res) => {
    // Coleta os erros de validação
    const erros = validationResult(req);

    // Cria o objeto de dados do formulário
    const dadosForm = {
        nome_usuario: req.body.nome_usuario,
        sobrenome_usuario: req.body.sobrenome_usuario,
        email_usuario: req.body.email_usuario,
        celular_usuario: req.body.celular_usuario,
        senha_usuario: criptografarSenha(req.body.senha_usuario),
    };

    // Verifica se há erros de validação
    if (!erros.isEmpty()) {
      console.log(erros);
        return res.render("pages/cadastro", {
            listaErros: erros.array(),
            dadosNotificacao: null,
            valores: req.body
        });
    }

    try {
        await usuario.create(dadosForm);

        res.render("pages/cadastro", {
            listaErros: null,
            dadosNotificacao: {
                titulo: "Cadastro realizado!",
                mensagem: "Novo usuário criado com sucesso!",
                tipo: "success"
            },
            valores: req.body
        });
    } catch (e) {
        console.error(e);
    }
}
}
 
module.exports = {usuarioController}