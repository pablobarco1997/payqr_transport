
const { Profil } = require("./class.profil");
const { User } = require("./class.user");
const { response } = require("./modules.response");

const new_account = async (req, res) => {
    try {
        const { datos, ope } = req.body;
        if (ope === 'create') {
            const profil = new Profil();

            const Ide = await profil.Identification_duplicate_valid({ CI: datos.ci });
            if (Ide === false)
                return res.json(response({ errorAlert: 'Identificación ya existente' }));

            const userValid = await profil.user_duplicate_valid({ user: datos.login });
            if (userValid === false)
                return res.json(response({ errorAlert: 'Nombre de usuario ya se encuentra registrado, atribuya uno diferente' }));

            const create = await profil.create({ datos });
            if (create === true)
                return res.json(response({ success: 1 }));
            else
                return res.json(response({ errorAlert: 'Error creating' }));

        }
        else
            return res.json(response({ errorAlert: 'error de session' }));
    } catch (error) {
        console.log(error);
    }
}

module.exports.new_account = new_account; 