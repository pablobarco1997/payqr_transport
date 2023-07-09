
const { Profil } = require("./class.profil");
const { User } = require("./class.user");
const { response } = require("./modules.response");

const update_data_users = async (req, res) => {
    try {
        const { user, pass, id, datos, token } = req.body;
        const ClassUser = new User(user, pass);
        const tokenValid = await ClassUser.token(token);
        if (tokenValid === 1) {
            const profil = new Profil();
            const results = await profil.actualizar({ id, datos });
            if (results)
                return res.json(response({ success: 1 }));
            else
                return res.json(response({ errorAlert: 'Error actualiza la información' }));
        }
        else
            return res.json(response({ errorAlert: 'Error de autenticación, cierre sesión e inicie nuevamente' }));
    } catch (error) {
        return res.json(response({ errorAlert: 'Response Server ' + error.message }));

    }
}

const all_users_account = async (req, res) => {
    try {
        const { user, pass, id, datos, token } = req.body;
        const ClassUser = new User(user, pass);
        const tokenValid = await ClassUser.token(token);
        if (tokenValid === 1) {
            const profil = new Profil();
            const results = await profil.allAcountusers({ idparent: id });
            if (results)
                return res.json(response({ success: 1, data: results }));
            else
                return res.json(response({ errorAlert: 'Error obteniendo los datos' }));
        } else {
            return res.json(response({ errorAlert: 'Error de autenticación, cierre sesión e inicie nuevamente' }));
        }
    } catch (error) {
        return res.json(response({ errorAlert: 'Response Server ' + error.message }));
    }
}

module.exports.update_data_users = update_data_users;
module.exports.all_users_account = all_users_account;

