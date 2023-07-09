
const mysql = require('mysql');

class connect {
    constructor() {
        this.host = "localhost";
        this.usuario = "root";
        this.contrasena = "";
        this.baseDatos = "sch_bus_payments";
    }

    conexion() {
        return mysql.createConnection({
            host: this.host,
            user: this.usuario,
            password: this.contrasena,
            database: this.baseDatos
        });
    }

    async where({ table, where, column = '*' }) {
        const db = this.conexion();
        return new Promise(function (resolve, reject) {
            const str = `select ${column} from ${table} where 1=1 ${where}`;
            db.query(str, (error, rows) => {
                if (error)
                    console.error(error);
                db.end();
                resolve(rows);
            })
        })
    }

    async insetInto({ tabla, datos }) {
        const db = this.conexion();
        return new Promise((resolve, reject) => {
            const str = `INSERT INTO ${tabla} SET ?`;
            db.query(str, datos, (error, rows) => {
                db.end();
                if (error) throw error;
                resolve(true);
            })
        })
    }

    async update({ tabla, datos, where }) {
        const db = this.conexion();
        return new Promise((resolve, reject) => {
            let param = [];
            Object.keys(datos).map(key => param.push(`${key} = '${datos[key] || ''}'`));
            const str = `UPDATE ${tabla} SET ${param.join(',')} ${where}`;
            db.query(str, (error, rows) => {
                if (error) throw error;
                db.end();
                resolve(true);
            })
        })
    }

}


module.exports.connect = connect; 