const { response } = require("express")
const { db } = require("../Conexiones/slq")

const createPersona = (request, response) => {
    const { per_id, per_nombres, per_apellidos } = request.body

    db.query('INSERT INTO seg_sis_persona (per_id, per_nombres, per_apellidos) VALUES ($1, $2, $3)', [per_id, per_nombres, per_apellidos], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Usuario externo added with ID: ${per_id}`)
    })
}

const getPersona = (request, response) => {

    const per_id = request.params.per_id;

    console.log('id is ' + per_id)
    db.query('SELECT * FROM rol_residente WHERE per_id = $1', [per_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}


const getAllPersona = (request, response) => {

    db.query('select * from seg_sis_persona ', (error, results) => {
        if (error)
            throw error
        response.status(200).json(results.rows)
    })
}


const deletePersona = (request, response) => {

    const per_id = request.params.per_id;

    console.log('id is ' + per_id)

    db.query('delete from seg_sis_persona where per_id=$1', [per_id], (error, results) => {
        if (error)
            throw error
        response.status(200).send(`deleted id is ${per_id}`)
    })
}


const updatePersona = (request, response) => {
    const per_id = request.params.per_id;
    const { rol_descripcion } = request.body
    console.log('id is ' + per_id)

    db.query('update rol_residente set rol_descripcion=$1 where per_id=$2', [rol_descripcion, per_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Rol Residente modified with ${per_id}`)
    })
}


module.exports = {
    createPersona,
    getPersona,
    getAllPersona,
    deletePersona,
    updatePersona

}
