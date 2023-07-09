const { connect } = require("./class.connect.mysql");

class Accredit extends connect {

    constructor({ idRow = "", id_users = "" }) {
        super();
        this.idRow = idRow;
        this._card_number = 'card_number';
        this._name_card = 'name_card';
        this._mm_yy = 'mm_yy';
        this._cvc = 'cvc';
        this._id_users = id_users;
    }

    fetchCard = async (id = "") => {
        let where = `and id_users = '${this._id_users}' `;
        if (id != "")
            where += `and rowid = '${id}'`;
        const response = await this.where({
            table: 'bp_card_cd',
            where: `${where}`,
            column: '*'
        });
        if (response.length === 0)
            return false;
        else
            return {
                id: response[0].rowid,
                number_card: response[0].card_numer,
                name_card: response[0].name_card,
                cvc: response[0].cvc,
                mm_yy: response[0].mm_yy
            }
    }

    accreditCrear = async ({ amount = 0 }) => {
        try {
            if (amount != 0) {
                const fetch = await this.fetchCard();
                const response = this.insetInto({
                    datos: [{
                        number_card: fetch?.number_card,
                        id_users: this._id_users,
                        amount: amount
                    }],
                    tabla: 'bp_accredit'
                });
                if (response)
                    return true;
                else return false;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
        }
    }


    Transaction = async ({ id_user_linea = 0, type_transaction = '', amount = 0, address = '', idusers = 0 }) => {
        try {
            const response = this.insetInto({
                datos: [{
                    address: address,
                    amount: amount,
                    type_transaction: type_transaction,
                    id_users: (idusers === 0 ? this._id_users : idusers),
                    id_user_linea: id_user_linea
                }],
                tabla: 'bp_transacciones'
            });
            if (response)
                return true;
            else
                return false;
        } catch (error) {
            console.error(error);
        }
    }

    validarTarjetaAsociadaExist = async ({ allColumn = false }) => {
        try {
            let cln = 'count(*) as valid';
            if (allColumn === true)
                cln = '*';
            let whereTarjeta = `and id_users = '${this._id_users}' `;
            const response = await this.where({
                column: cln,
                table: 'bp_card_cd',
                where: whereTarjeta
            });
            if (allColumn === true)
                return response[0];
            else
                return response[0]['valid'];
        } catch (error) {
            console.error(error);
        }
    }


    newTarjeta = async ({ card_numer, name_card, mm_yy, cvc }) => {
        try {
            const response = await this.insetInto({
                tabla: 'bp_card_cd',
                datos: [{ card_numer, name_card, mm_yy, cvc, id_users: this._id_users }]
            });
            return response === true ? true : false;
        } catch (error) {
            console.error(error);
        }
    }

    updateTarjeta = async ({ card_numer, name_card, mm_yy, cvc, idCard }) => {
        try {
            console.log({ card_numer, name_card, mm_yy, cvc, idCard });
            const response = await this.update({
                tabla: 'bp_card_cd',
                datos: { card_numer, name_card, mm_yy, cvc },
                where: 'where  rowid = ' + idCard
            });
            return response === true ? true : false;
        } catch (error) {

        }
    }


    AmountClient = async () => {
        try {
            const response = await this.where({
                table: 'bp_transacciones',
                column: 'ifnull(sum(amount), 0) as amount',
                where: `and id_users = '${this._id_users}' `,
            })
            return response[0].amount;
        } catch (error) {

        }
    }

    ListTransactionsPasajeros = async ({ creditedOnly = false }) => {
        try {
            let strCredit = '';
            if (creditedOnly === true)
                strCredit = `  and type_transaction = 'D' `;
            const response = await this.where({
                table: 'bp_transacciones',
                column: '*',
                where: `and id_users = '${this._id_users}' ${strCredit} order by rowid desc; `,
            })
            return response;
        } catch (error) {

        }
    }



}


module.exports.Accredit = Accredit; 