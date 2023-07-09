
const { Accredit } = require("./class.accredit");
const { User } = require("./class.user");
const { response } = require("./modules.response");

const addaccredit = async (req, res) => {
    try {
        const { id, token, user, pass, amount } = req.body;
        const users = new User(user, pass);
        const tokenInvalid = await users.token(token);
        if (!tokenInvalid) {
            res.json(response({ error: 'Token Inválido del usuario Inicie sesión Nuevamente' }))
            return;
        } else {
            //se valida la targeta existente
            const acc = new Accredit({ id_users: id });
            const TarjetValid = await acc.validarTarjetaAsociadaExist({ allColumn: false });
            if (TarjetValid) {
                const accCreate = await acc.accreditCrear({ amount: amount });
                if (accCreate === false)
                    res.json(response({ errorAlert: 'Monto/Saldo asignado Invalid' }));
                else {
                    //Se realiza la transaccion "el ingreso de su saldo al sistema commo deposito"
                    const deposito = await acc.Transaction({
                        address: 'Registro de acreditación',
                        amount: amount,
                        type_transaction: 'D',
                        id_user_linea: 0

                    });
                    if (deposito)
                        res.json(response({ success: 'success' }));
                    else
                        res.json(response({ error: 'Error de operación' }))
                }
            } else {
                res.json(response({ error: 'Invalid Tarjeta Registro. Verifique la información de su tarjeta asociada' }))
            }
        }
    } catch (error) {
        console.error(error);
    }
}



const new_tarjeta = async (req, res) => {
    try {
        const { id, token, user, pass, datos } = req.body;
        const users = new User(user, pass);
        const tokenInvalid = await users.token(token);
        if (!tokenInvalid) {
            res.json(response({ error: 'Token Inválido del usuario Inicie sesión Nuevamente' }))
            return;
        } else {

            //codigo operacion create tarjeta
            const acc = new Accredit({ id_users: id });
            const TarjetValid = await acc.validarTarjetaAsociadaExist({ allColumn: false });
            if (!TarjetValid) { //false new create
                const nw = await acc.newTarjeta({ ...datos });
                if (nw)
                    res.json(response({ success: 'success' }));
                else
                    res.json(response({ error: 'error de operación asociar registro de tarjeta' }));
            } else {//true update
                //console.log(datos);
                const nu = await acc.updateTarjeta({ ...datos })
                if (nu)
                    res.json(response({ success: 'success' }));
                else
                    res.json(response({ error: 'error de operación actualización de tarjeta' }));
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const FetchTarjeta = async (req, res) => {
    try {
        const { id, token, user, pass } = req.body;
        const users = new User(user, pass);
        const tokenInvalid = await users.token(token);
        if (!tokenInvalid) {
            res.json(response({ error: 'Token Inválido del usuario Inicie sesión Nuevamente' }))
        } else {
            //code operation
            const acc = new Accredit({ id_users: id });
            const accFetchCard = await acc.fetchCard();
            res.json(response({ success: 'ok', data: accFetchCard }));
        }
    } catch (error) {
        console.log(error);
    }
}


const AmountBalance = async (req, res) => {
    try {
        const { id, token, user, pass } = req.body;
        const users = new User(user, pass);
        const tokenInvalid = await users.token(token);
        if (!tokenInvalid) {
            res.json(response({ error: 'Token Inválido del usuario Inicie sesión Nuevamente' }))
        } else {//code operationz
            const isChindren = await users.isChildrenAcount(id); //se verifica la cuenta si es hija
            if (isChindren) { //consulto el balance general de la cuenta admin si en caso es children
                const usersParents = await users.fetch(id);
                const acc = new Accredit({ id_users: usersParents[0]?.idparent });
                const accAmount = await acc.AmountClient();
                res.json(response({ success: 'ok', data: accAmount }));
            } else {
                const acc = new Accredit({ id_users: id });
                const accAmount = await acc.AmountClient();
                res.json(response({ success: 'ok', data: accAmount }));
            }
        }
    } catch (error) {
        console.error(error);
    }
}


//historial de transacciones de los pasajeros
const TransaccionesListado = async (req, res) => {
    try {
        const { id, token, user, pass, creditedOnly } = req.body;
        const users = new User(user, pass);
        const tokenInvalid = await users.token(token);
        if (!tokenInvalid) {
            res.json(response({ error: 'Token Inválido del usuario Inicie sesión Nuevamente' }))
        } else {//code operationz
            const isChindren = await users.isChildrenAcount(id); //se verifica la cuenta si es hija
            if (isChindren === true) {
                const usersParents = await users.fetch(id);
                const acc = new Accredit({ id_users: usersParents[0]?.idparent });
                const TransData = await acc.ListTransactionsPasajeros({ creditedOnly });
                res.json(response({ success: 'ok', data: TransData }));
            } else {
                const acc = new Accredit({ id_users: id });
                const TransData = await acc.ListTransactionsPasajeros({ creditedOnly });
                res.json(response({ success: 'ok', data: TransData }));
            }
        }
    } catch (error) {
        console.error(error);
    }
}


//lista de transacciones de pagos de los clientes o pasajeros 
const TransaccionPaymentsClient = async (req, res) => {
    try {
        const { id, token, user, pass, transporte } = req.body;
        let AmountPayment = 0.35; //monto es de 35
        const users = new User(user, pass);
        const tokenInvalid = await users.token(token);
        if (!tokenInvalid) {
            res.json(response({ error: 'Token Inválido del usuario Inicie sesión Nuevamente' }));
        }
        else {//code operationz
            const usuerioP = await users.fetch(id);
            const isChindren = await users.isChildrenAcount(id); //se verifica la cuenta si es hija
            const id_userio_axu = (isChindren === true ? usuerioP[0]?.idparent : id); //se valida si la cuenta es hija 

            const acc = new Accredit({ id_users: id_userio_axu });
            const validuserd = await users.fetch(transporte?.id);
            if (validuserd[0]?.type_users === 'T') { //El usuario transporte tiene que existir
                //validamos el tipo de tarifa

                const tipoPasajero = usuerioP[0]?.tipo;
                if (tipoPasajero === 'Normal')
                    AmountPayment = 0.30;
                if (tipoPasajero === 'Estudiante' || tipoPasajero === 'Tercera Edad' || tipoPasajero === 'Discapacidad')
                    AmountPayment = 0.15

                //se valida el cupo disponible 
                const cupo = await acc.AmountClient();//monto admin
                if (cupo >= AmountPayment) {
                    //cobro pasajero
                    const address = ` Ruta ${transporte?.line}`;
                    //egreso de creidto pagado
                    const accPasajero = await acc.Transaction({ address: `Pago ${usuerioP[0]?.nom} ${tipoPasajero != 'Normal' ? tipoPasajero : ''} ${address}`, amount: (AmountPayment * -1), id_user_linea: transporte?.id, type_transaction: 'U' });
                    //ingreso de creidto cobrado
                    //id usuario del transporte 
                    //id_user_linea usuario quien tomo la parada pasajero
                    const accTransporte = await acc.Transaction({ address: `Cobro ${address} ${usuerioP[0]?.nom}`, amount: AmountPayment, id_user_linea: id, idusers: transporte?.id, type_transaction: 'T' });
                    if (accPasajero && accTransporte)
                        res.json(response({ success: 'ok' }));
                    else
                        res.json(response({ error: 'ocurrio un problema con la operaciòn' }));
                } else {
                    res.json(response({ error: 'Cupo no disponible' }));
                }
            }
            else
                res.json(response({ error: 'Datos del codigo QR Incorrectos, Intentelo de nuevo.' }));
        }
    } catch (error) {
        console.error(error);
    }
}




module.exports.addaccredit = addaccredit;
module.exports.new_tarjeta = new_tarjeta;
module.exports.FetchTarjeta = FetchTarjeta;
module.exports.AmountBalance = AmountBalance;
module.exports.TransaccionesListado = TransaccionesListado;
module.exports.TransaccionPaymentsClient = TransaccionPaymentsClient; 
