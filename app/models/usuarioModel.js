var pool = require("../../config/pool_conexoes");


    const usuarioModel = {
        findAll: async () => {
            try {
                const [resultados] = await pool.query( 
                  "SELECT * FROM blpkdphhphnmf0o8ikdt.usuario; u.id_usuario, u.cpf_usuario, u.email_usuario, " + 
                  "u.celular_usuario, u.senha_usuario, u.data_nasc_usuario, u.nome_usuario, " +
                  "FROM usuario u, tipo_usuario t where u.status_usuario = 1 and " +
                  "u.tipo_usuario = t.id_tipo_usuario"
                )
                return resultados;
            } catch (error) {
                console.log(error);
                return error;  
            }
        },

        findUserEmail: async (camposForm) => {
            try {
                const [resultados] = await pool.query(
                    "SELECT * FROM usuario WHERE cpf_usuario = ? or email_usuario = ?",
                    [camposForm.user_usuario, camposForm.user_usuario]
                )
                return resultados;
            } catch (error) {
                console.log(error);
                return error;
            }
        },

        findCampoCustom: async (criterioWhere) => {
            try {
                const [resultados] = await pool.query(
                    "SELECT count(*) totalReg FROM usuario WHERE ?",
                    [criterioWhere]
                )
                return resultados[0].totalReg;
            } catch (error) {
                console.log(error);
                return error;
            }
        },

        findId: async (id) => {
            try {
                const [resultados] = await pool.query(
                    "SELECT * FROM blpkdphhphnmf0o8ikdt.usuario; u.id_usuario, u.cpf_usuario, u.email_usuario, " + 
                    "u.celular_usuario, u.senha_usuario, u.data_nasc_usuario, u.nome_usuario, " +
                    "FROM usuario u, tipo_usuario t where u.status_usuario = 1 and " +
                    "u.tipo_usuario = t.id_tipo_usuario and u.id_usuario = ? ", [id]
                )
                return resultados;
            } catch (error) {
                console.log(error);
                return error;
            }
        },


        create: async (camposForm) => {
            try {
                
                if (camposForm.senha_usuario !== camposForm.confirmPassword) {
                    return { error: "As senhas não coincidem." };
                }
    
             
                const senhaHash = await bcrypt.hash(camposForm.senha_usuario, 10); 
                camposForm.senha_usuario = senhaHash;
    
                // Remover o campo confirmPassword (não deve ser salvo no banco)
                delete camposForm.confirmPassword;
    
                // Inserção no banco de dados
                const [resultados] = await pool.query(
                    "INSERT INTO usuario SET ?", [camposForm]
                );
                console.log("Usuário inserido com sucesso!");
                return resultados;  // Retorna os resultados da query
            } catch (error) {
                console.log(error);
                return null;
            }
        },
    

        update: async (camposForm, id) => {
            try {
                const [resultados] = await pool.query(
                    "UPDATE usuario SET ? " +
                    " WHERE id_usuario = ?",
                    [camposForm, id]
                )
                return resultados;
            } catch (error) {
                console.log(error);
                return error;
            }
        },

        delete: async (id) => {
            try {
                const [resultados] = await pool.query(
                    "UPDATE usuario SET status_usuario = 0 WHERE id_usuario = ? ", [id]
                )
                return resultados;
            } catch (error) {
                console.log(error);
                return error;
            }
        },
    };

    module.exports = usuarioModel