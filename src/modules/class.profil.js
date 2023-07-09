

const { connect } = require("./class.connect.mysql");

class Profil extends connect {
    constructor() {
        super();
    }

    user_duplicate_valid = async ({ user }) => {
        const response = await this.where({
            table: 'bp_users_profile',
            column: 'count(*) as valid_count ',
            where: `and login = '${user}'`
        });
        const { valid_count } = response[0];
        return valid_count === 1 ? false : true;
    }

    Identification_duplicate_valid = async ({ CI }) => {
        const response = await this.where({
            table: 'bp_users_profile',
            column: 'count(*) as valid_count ',
            where: `and ci = '${CI}'`
        });
        const { valid_count } = response[0];
        return valid_count === 1 ? false : true;
    }

    create = async ({ datos }) => await this.insetInto({ tabla: 'bp_users_profile', datos });

    actualizar = async ({ id, datos }) => {
        const response = this.update({
            tabla: 'bp_users_profile',
            where: `where rowid = ${id}`,
            datos: { ...datos }
        });
        return response;
    }

    allAcountusers = async ({ idparent = 0 }) => {
        const response = await this.where({
            table: 'bp_users_profile',
            column: ' rowid, login , email, nom , ci, pass',
            where: `and idparent = '${idparent}'`
        });
        return response;
    }

}


module.exports.Profil = Profil;

