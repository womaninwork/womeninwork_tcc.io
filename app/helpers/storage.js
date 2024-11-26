const multer = require('multer');

// Configurando o storage em memória
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
