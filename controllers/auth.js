
const { response } = require("express")
const { db } = require("../Conexiones/slq")
const { compare } = require("../Helpers/handleBcrypt")
const { tokenSign } = require("../Helpers/generateToken")

const loginCtrl = async (req, res) => {
    try {
        const { res_usuario, res_clave } = req.body

        db.query('select r.per_id, r.res_usuario, r.res_clave, rr.rol_descripcion from residente r inner join rol_residente rr on r.rol_id=rr.rol_id where res_usuario=$1', [res_usuario], async (error, results) => {

            if (results.rows == '') {
                res.status(200).send(`{"status":"Ok", "resp":"Usuario no registrado"}`)
            } else {
                if (error) {
                    res.status(404).send(`{"status":"Error", "resp":"Error"}`)
                } else {
                    checkPassword = await compare(res_clave, results.rows[0].res_clave);
                    if (checkPassword) {

                        const token = await tokenSign(results.rows[0].per_id, results.rows[0].rol_descripcion);
                        // response.status.send(data)
                        res.status(200).send(`{"status":"OK", "resp":"${token}"}`)

                    } else {
                        res.status(200).send(`{"status":"Ok", "resp":"Contaseña incorrecta"}`)
                    }
                }
            }

        })
    } catch (error) {
        res.status(404).send(`{"status":"Error", "resp":"Error"}`)
    }



}

module.exports = {
    loginCtrl

}