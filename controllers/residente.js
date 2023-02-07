const { response } = require("express")
const { db } = require("../Conexiones/slq")
const { encrypt } = require("../Helpers/handleBcrypt")

const createResidente = async (request, response) => {

    const { per_id, per_nombres, per_apellidos, res_correo, res_telefono, res_usuario, res_clave, rol_id, res_id } = request.body

    const password = await encrypt(res_clave);

    db.query('select per_nombres, per_apellidos from seg_sis_persona WHERE per_id = $1', [per_id], (error, results) => {
        if (results.rows == "") {
            db.query('INSERT INTO seg_sis_persona (per_id, per_nombres,per_apellidos ) VALUES ($1, $2, $3)', [per_id, per_nombres, per_apellidos], (error, results) => {
                if (error) {
                    response.status(201).send(`{"status":"Error", "resp":"Algo salio mal "}`)
                } else {
                    db.query('INSERT INTO seg_sis_residente (res_correo, res_telefono, res_usuario, res_clave, rol_id, per_id, res_id) VALUES ($1, $2, $3, $4, $5, $6, $7)', [res_correo, res_telefono, res_usuario, password, rol_id, per_id, res_id], (error, results) => {
                        if (error) {
                            response.status(201).send(`{"status":"Error", "resp":"Algo salio mal "}`)
                            // console
                            console.log(error)
                        } else {
                            response.status(201).send(`{"status":"OK", "resp":"Resgitrado exitosamente"}`)
                        }

                    })
                }

            })

        } else {
            db.query('select * from seg_sis_residente WHERE per_id = $1', [per_id], (error, results) => {
                if (results.rows == "") {
                    db.query('INSERT INTO seg_sis_residente (res_correo, res_telefono, res_usuario, res_clave, rol_id,per_id, res_id) VALUES ($1, $2, $3, $4, $5, $6, $7)', [res_correo, res_telefono, res_usuario, password, rol_id, per_id, res_id], (error, results) => {
                        if (error) {
                            response.status(201).send(`{"status":"Error", "resp":"Algo salio mal "}`)
                        } else {
                            response.status(201).send(`{"status":"OK", "resp":"Resgitrado exitoramente"}`)
                        }

                    })

                } else {
                    response.status(201).send(`{"status":"Error", "resp":"Residente ya registrado"}`)
                }

            })


        }

    })



}


const getResidente = (request, response) => {

    const per_id = request.params.per_id;
    db.query('select p.per_id, p.per_nombres,p.per_apellidos, rr.rol_descripcion, r.res_correo, r.res_telefono from seg_sis_residente r inner join seg_sis_persona  p on p.per_id=r.per_id inner join seg_sis_rol_residente rr on r.rol_id=rr.rol_id WHERE p.per_id = $1', [per_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })

}


const getAllResidente = (request, response) => {
    db.query('select p.per_id, p.per_nombres,p.per_apellidos, rr.rol_descripcion, r.res_correo, r.res_telefono, r.res_clave, res_usuario from seg_sis_residente r inner join seg_sis_persona  p on p.per_id=r.per_id inner join seg_sis_rol_residente rr on r.rol_id=rr.rol_id', (error, results) => {
        if (error)
            throw error
        response.status(200).json(results.rows)
    })
}


const deleteResidente = (request, response) => {

    const res_id = request.params.res_id;

    db.query('delete from seg_sis_residente where res_id=$1', [res_id], (error, results) => {
        
        if (error)
            throw error
        response.status(200).send(`deleted id is ${res_id}`)
    })
}


const updateResidente = (request, response) => {
    const per_id = request.params.per_id;
    const { per_nombres, per_apellidos, res_correo, res_telefono, res_usuario, res_clave, rol_id, res_id } = request.body
    // console.log('id is ' + rol_id)

    db.query('update seg_sis_persona set per_nombres=$1, per_apellidos=$2 where per_id=$3', [per_nombres, per_apellidos, per_id], (error, results) => {
        if (error) {
            response.status(201).send(`{"status":"Error", "resp":"Alg"}`)
        } else {
            db.query('update seg_sis_residente set res_correo=$1, res_telefono=$2, res_usuario=$3, res_clave=$4, rol_id=$5  where per_id=$6', [res_correo, res_telefono, res_usuario, res_clave, rol_id, per_id], (error, results) => {
                if (error) {
                    response.status(201).send(`{"status":"Error", "resp":"Algo salio mal"}`)
                } else {
                    response.status(201).send(`{"status":"Ok", "resp":"Usuario moodificado"}`)
                }

            })
        }

    })
}


module.exports = {
    createResidente,
    getResidente,
    getAllResidente,
    deleteResidente,
    updateResidente

}