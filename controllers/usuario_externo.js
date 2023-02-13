const { response } = require("express")
const { db } = require("../Conexiones/slq")

const createUsuarioExterno = async (request, response) => {

    const { use_fecha, per_id, use_descripcion, per_nombres, per_apellidos } = request.body

    db.query('select per_nombres, per_apellidos from seg_sis_persona WHERE per_id = $1', [per_id], (error, results) => {
        if (results.rows == "") {
            db.query('INSERT INTO seg_sis_persona (per_id, per_nombres,per_apellidos ) VALUES ($1, $2, $3)', [per_id, per_nombres, per_apellidos], (error, results) => {
                if (error) {
                    response.status(201).send(`{"status":"Error", "resp":"Algo salió mal"}`)
                }
                db.query('INSERT INTO seg_cond_usuario_externo (use_fecha, per_id, use_descripcion ) VALUES ($1, $2, $3)', [use_fecha, per_id, use_descripcion], (error, results) => {
                    if (error) {
                        response.status(201).send(`{"status":"Error", "resp":"Algo salió mal"}`)
                    }
                    response.status(201).send(`{"status":"OK", "resp":"Resgitrado exitosamente"}`)
                })
            })
        } else {
            db.query('select * from seg_cond_usuario_externo WHERE per_id = $1', [per_id], (error, results) => {
                if (results.rows == "") {
                    db.query('INSERT INTO seg_cond_usuario_externo (use_fecha, per_id, use_descripcion ) VALUES ($1, $2, $3)',
                        [use_fecha, per_id, use_descripcion], (error, results) => {
                            if (error) {
                                response.status(201).send(`{"status":"Error", "resp":"Algo salió mal"}`)
                            }
                            response.status(201).send(`{"status":"OK", "resp":"Resgitrado exitosamente"}`)
                        })
                } else {
                    response.status(201).send(`{"status":"Error", "resp":"Usuario ya registrado"}`)
                }

            })


        }

    })



}


const getUsuarioExterno = (request, response) => {

    const per_id = request.params.per_id;
    db.query('select p.per_id, p.per_nombres,p.per_apellidos,ue.use_fecha, ue.use_descripcion from seg_cond_usuario_externo ue inner join seg_sis_persona p on p.per_id=ue.per_id WHERE p.per_id = $1', [per_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })

}


const getAllUsuarioExterno = (request, response) => {
    db.query('select ue.use_id, p.per_id, p.per_nombres,p.per_apellidos,ue.use_fecha, ue.use_descripcion from seg_cond_usuario_externo ue inner join seg_sis_persona p on p.per_id=ue.per_id', (error, results) => {
        if (error)
            throw error
        response.status(200).json(results.rows)
    })
}


const deleteUsuarioExterno = (request, response) => {

    const use_id = request.params.use_id;

    db.query('delete from seg_cond_usuario_externo where use_id=$1', [use_id], (error, results) => {
        if (error)
            throw error
        response.status(200).send(`deleted id is ${use_id}`)
    })
}


const updateUsuarioExterno = (request, response) => {
    const per_id = request.params.per_id;
    const { per_nombres, per_apellidos, use_fecha, use_descripcion } = request.body
    // console.log('id is ' + rol_id)

    db.query('update seg_sis_persona set per_nombres=$1, per_apellidos=$2 where per_id=$3', [per_nombres, per_apellidos, per_id], (error, results) => {
        if (error) {
            response.status(201).send(`{"status":"Error", "resp":"Alg"}`)
        } else {
            db.query('update seg_cond_usuario_externo set use_fecha=$1, use_descripcion=$2 where per_id=$3', [use_fecha, use_descripcion, per_id], (error, results) => {
                if (error) {
                    response.status(201).send(`{"status":"Error", "resp":"Algo salió mal"}`)
                } else {
                    response.status(201).send(`{"status":"Ok", "resp":"Usuario moodificado"}`)
                }

            })
        }

    })
}


module.exports = {
    createUsuarioExterno,
    getUsuarioExterno,
    getAllUsuarioExterno,
    deleteUsuarioExterno,
    updateUsuarioExterno

}