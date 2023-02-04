const { response } = require("express")
const { db } = require("../Conexiones/slq")

const createTipoServicio = (request, response) => {
    const { tser_descripcion } = request.body

    db.query('INSERT INTO gest_adm_tipo_servicio (tser_descripcion ) VALUES ($1)', [tser_descripcion], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Tipo Servicio added with ID: ${tser_descripcion}`)
    })
}

const getTipoServicioById = (request, response) => {

    const tser_id = request.params.tser_id;

    console.log('id is ' + tser_id)
    db.query('SELECT * FROM gest_adm_tipo_servicio WHERE tser_id = $1', [tser_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}


const getAllTipoServicios = (request, response) => {

    db.query('select * from gest_adm_tipo_servicio ', (error, results) => {
        if (error)
            throw error
        response.status(200).json(results.rows)
    })
}


const deleteTipoServicio = (request, response) => {

    const tser_id = request.params.tser_id;

    console.log('id is ' + tser_id)

    db.query('delete from gest_adm_tipo_servicio where tser_id=$1', [tser_id], (error, results) => {
        if (error)
            throw error
        response.status(200).send(`deleted id is ${tser_id}`)
    })
}


const updateTipoServicio = (request, response) => {
    const tser_id = request.params.tser_id;
    const { tser_descripcion } = request.body
    console.log('id is ' + tser_id)

    db.query('update gest_adm_tipo_servicio set tser_descripcion=$1 where tser_id=$2', [tser_descripcion, tser_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Tipo Servicio modified with ${tser_id}`)
    })
}


module.exports = {
    createTipoServicio,
    getTipoServicioById,
    getAllTipoServicios,
    deleteTipoServicio,
    updateTipoServicio

}