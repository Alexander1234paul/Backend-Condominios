const { response } = require("express")
const { db } = require("../Conexiones/slq")

const createRolResidente = (request, response) => {
    const { rol_descripcion } = request.body
    db.query('INSERT INTO seg_sis_rol_residente (rol_descripcion ) VALUES ($1)', [rol_descripcion], (error, results) => {
        if (error) {
            // throw error
            response.status(400).send(`{}`)
        } else {
            response.status(201).send(`{}`)
        }
    })

}
const getRolResidenteById = (request, response) => {
    const rol_id = request.params.rol_id;
    console.log('id is ' + rol_id)
    db.query('SELECT * FROM seg_sis_rol_residente WHERE rol_id = $1', [rol_id], (error, results) => {
        if (error) {
            throw error
        } else {
            response.status(200).json(results.rows)
        }

    })
}
const getAllRolResidentes = (request, response) => {

    db.query('select * from seg_sis_rol_residente ', (error, results) => {
        if (error) {
            response.status(400).send(`{}`)
        } else {
            response.status(200).json(results.rows)
        }


    })
}
const deleteRolResidente = (request, response) => {
    const rol_id = request.params.rol_id;
    db.query('delete from seg_sis_rol_residente where rol_id=$1', [rol_id], (error, results) => {
        if (error) {

            response.status(401).send(`{}`)
        } else {
            response.status(201).send(`{}`)
        }
    })
    // response.status(200).send(`Eliminado`)
}


const updateRolResidente = (request, response) => {
    const rol_id = request.params.rol_id;
    const { rol_descripcion } = request.body
    console.log('id is ' + rol_id)

    db.query('update seg_sis_rol_residente set rol_descripcion=$1 where rol_id=$2', [rol_descripcion, rol_id], (error, results) => {
        if (error) {
            response.status(201).send(`{}`)
        } else {
            response.status(201).send(`{}`)
        }
    })
}


module.exports = {
    createRolResidente,
    getRolResidenteById,
    getAllRolResidentes,
    deleteRolResidente,
    updateRolResidente

}