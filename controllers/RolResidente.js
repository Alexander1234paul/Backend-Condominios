const { response } = require("express")
const { db } = require("../Conexiones/slq")

const createRolResidente = (request, response) => {
    const { rol_id, rol_descripcion } = request.body

    db.query('INSERT INTO seg_sis_rol_residente (rol_id, rol_descripcion ) VALUES ($1, $2)', [rol_id, rol_descripcion], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Rol Residente added with ID: ${rol_id}`)
    })
}

const getRolResidenteById = (request, response) => {

    const rol_id = request.params.rol_id;

    console.log('id is ' + rol_id)
    db.query('SELECT * FROM seg_sis_rol_residente WHERE rol_id = $1', [rol_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}


const getAllRolResidentes = (request, response) => {

    db.query('select * from seg_sis_rol_residente ', (error, results) => {
        if (error)
            throw error
        response.status(200).json(results.rows)
    })
}


const deleteRolResidente = (request, response) => {

    const rol_id = request.params.rol_id;

    console.log('id is ' + rol_id)

    db.query('delete from seg_sis_rol_residente where rol_id=$1', [rol_id], (error, results) => {
        if (error)
            throw error
        response.status(200).send(`deleted id is ${rol_id}`)
    })
}


const updateRolResidente = (request, response) => {
    const rol_id = request.params.rol_id;
    const { rol_descripcion } = request.body
    console.log('id is ' + rol_id)

    db.query('update seg_sis_rol_residente set rol_descripcion=$1 where rol_id=$2', [rol_descripcion, rol_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Rol Residente modified with ${rol_id}`)
    })
}


module.exports = {
    createRolResidente,
    getRolResidenteById,
    getAllRolResidentes,
    deleteRolResidente,
    updateRolResidente

}