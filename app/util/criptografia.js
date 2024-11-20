const bcrypt = require("bcryptjs");
 
const saltRounds = 12;
 
// Função para criptografar senha
const criptografarSenha = (senha) => {
  return bcrypt.hashSync(senha, bcrypt.genSaltSync(saltRounds));
};
 
// Função para comparar senha fornecida com a criptografada
const compararSenha = (senha, hash) => {
  return bcrypt.compareSync(senha, hash);
};
 
module.exports = {
  criptografarSenha,
  compararSenha,
};