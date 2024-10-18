const usuario = require("../models/usuarioModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(12);
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
        body("nome_usu")
          .isLength({ min: 5, max: 35 }).withMessage("O nome de usuário/e-mail deve ter de 5 a 35 caracteres"),
        body("nomeusu_usu")
          .isLength({ min: 8, max: 45 }).withMessage("Nome de usuário deve ter de 8 a 45 caracteres!")
          .custom(async value => {
            const nomeUsu = await usuario.findCampoCustom({ 'user_usuario': value });
            if (nomeUsu > 0) {
              throw new Error('Nome de usuário em uso!');
            }
          }),
        body("email_usu")
          .isEmail().withMessage("Digite um e-mail válido!")
          .custom(async value => {
            const emailUsu = await usuario.findCampoCustom({ 'email_usuario': value });
            if (emailUsu > 0) {
              throw new Error('E-mail em uso!');
            }
          }),
        body("senha_usu")
          .isStrongPassword()
          .withMessage("A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)")
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
        senha_usuario: bcrypt.hashSync(req.body.senha_usuario, salt),
        tipo_usuario_id_tipo_usuario: req.body.tipo_usuario_id_tipo_usuario, // Ajuste conforme necessário
        cursos_id_cursos: req.body.cursos_id_cursos // Ajuste conforme necessário
    };

    // Verifica se há erros de validação
    if (!erros.isEmpty()) {
        return res.render("pages/cadastro", {
            listaErros: erros.array(),
            dadosNotificacao: null,
            valores: req.body
        });
    }

    try {
        // Cria o usuário no banco de dados
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
        res.render("pages/cadastro", {
            listaErros: [{ msg: "Erro ao cadastrar usuário. Tente novamente." }],
            dadosNotificacao: null,
            valores: req.body
        });
    }
}
}
 
module.exports = {usuarioController}