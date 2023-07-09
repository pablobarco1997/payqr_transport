
const { connect } = require("./class.connect.mysql");

class User extends connect {

    constructor(_user, _pass) {
        super();
        this.user = _user;
        this.pass = _pass;
    }

    async isChildrenAcount(id) {
        const response = await this.where({
            table: 'bp_users_profile',
            column: 'count(*) isv',
            where: ` and rowid = ${id} and idparent != 0`
        });
        if (response.length > 0)
            return response[0]?.isv > 0 ? true : false
        else
            return false;
    }

    async fetch(id = "") {
        let whereUser = `and login = '${this.user}' and pass = '${this.pass}'`;
        if (id != "")
            whereUser = 'and rowid = ' + id;
        const response = await this.where({
            table: 'bp_users_profile',
            where: whereUser
        });
        return response;
    }

    async valid() {
        const response = await this.where({
            column: 'count(*) as countValue',
            table: 'bp_users_profile',
            where: `and login = '${this.user}' and pass = '${this.pass}'`
        });
        return response[0]['countValue'];
    }

    async token(token) {
        const response = await this.where({
            column: 'count(*) as token ',
            table: 'bp_users_profile',
            where: `and concat(login,pass)  = '${token}'`
        })
        return response.length != 0 ? response[0]['token'] : 0;
    }

}

module.exports.User = User; 
