const { Router } = require("express");
const { token_users_valid, fetch_datos_user } = require("../modules/modules.token.user");
const { update_data_users, all_users_account } = require("../modules/modules.profil");
const { new_account } = require("../modules/modules.new_account");
const { addaccredit, new_tarjeta, FetchTarjeta, AmountBalance, TransaccionesListado, TransaccionPaymentsClient } = require("../modules/modules.accredit");

const routers = Router();

routers.post("/token_users_valid", token_users_valid);
routers.post("/update_data_users", update_data_users);
routers.post("/fetch_datos_user", fetch_datos_user);
routers.post("/new_account", new_account);
routers.post("/fetch_all_account_users", all_users_account);
routers.post("/addaccredit", addaccredit);
routers.post("/new_tarjeta", new_tarjeta);
routers.post("/fetch_card_cd", FetchTarjeta);
routers.post("/AmountBalance", AmountBalance);
routers.post("/TransaccionesListado", TransaccionesListado);
routers.post("/TransaccionPaymentsClient", TransaccionPaymentsClient);


module.exports.routers = routers;