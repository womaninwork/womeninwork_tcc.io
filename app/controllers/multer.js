const multer = require('multer');
const path = require('path');

// Configuração de armazenamento
const salvarPasta = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Adiciona a extensão original
    }
});

// Configurações do multer
const upload = multer({
    storage: salvarPasta,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limite de 5MB
        files: 5, // Limite de 5 arquivos
        fieldNameSize: 100, // Limite de 100 caracteres para o nome do campo
        fieldSize: 10 * 1024 * 1024 // Limite de 10MB para o tamanho do campo
    },
    fileFilter: (req, file, cb) => {
        // Verifica se o tipo MIME do arquivo é imagem/jpeg
        if (file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else {
            cb(new Error('Apenas imagens JPEG são permitidas'), false);
        }
    }
});

// Exemplo de uso do upload
// app.post('/upload', upload.array('files'), (req, res) => {
//     res.send('Arquivos enviados com sucesso!');
// });

const filename = path.basename('/path/to/file.txt');
console.log(filename); // 'file.txt'
const filenameWithoutExt = path.basename('/path/to/file.txt', '.txt');
console.log(filenameWithoutExt); // 'file'
const dir = path.dirname('/path/to/file.txt');
console.log(dir); // '/path/to'
const ext = path.extname('/path/to/file.txt');
console.log(ext); // '.txt'
const normalizedPath = path.normalize('/usr//local/bin/file.txt');
console.log(normalizedPath) // '/usr/local/bin/file.txt'

fstat.unlink('example.txt', (err) => {
    if (err) throw err;
    console.log('arquivo removido');
});