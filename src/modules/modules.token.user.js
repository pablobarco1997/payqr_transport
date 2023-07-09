
const { User } = require("./class.user");
const { response } = require("./modules.response");

const token_users_valid = async (req, res) => {
    try {
        const { p_user, p_pass } = req.body;
        console.log(req.body);
        const _user = new User(p_user, p_pass);
        const valid = await _user.valid();
        const datos = await _user.fetch();
        if (valid === 1)
            return res.json(response({ success: 1, data: datos[0] }));
        else
            return res.json(response({ success: 0 }));
    } catch (error) {
        console.error(error);
    }
}

const fetch_datos_user = async (req, res) => {
    try {
        const { user, pass, id, token } = req.body;
        const users = new User(user, pass);
        const Tokenvalid = await users.token(token);
        if (Tokenvalid === 1) {
            const response = await users.fetch(id);
            console.log(response);
            return res.json(response({ success: 1, data: response[0] }));
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports.token_users_valid = token_users_valid;
module.exports.fetch_datos_user = fetch_datos_user; 