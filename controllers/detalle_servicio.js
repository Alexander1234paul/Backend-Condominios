const { response } = require("express")
const { db } = require("../Conexiones/slq")

const createDetalleServicio = (request, response) => {
    const { dser_evidencia, ser_id } = request.body

    db.query('INSERT INTO res_detalle_servicio (dser_evidencia, ser_id ) VALUES ($1, $2)', [dser_evidencia, ser_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Tipo Servicio added with: ${dser_evidencia, ser_id}`)
    })
}

const getDetalleServicioById = (request, response) => {

    const dser_id = request.params.dser_id;

    console.log('id is ' + dser_id)
    db.query('SELECT * FROM res_detalle_servicio WHERE dser_id = $1', [dser_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}


const getAllDetalleServicios = (request, response) => {

    db.query('select * from res_detalle_servicio ', (error, results) => {
        if (error)
            throw error
        response.status(200).json(results.rows)
    })
}


const deleteDetalleServicio = (request, response) => {

    const dser_id = request.params.dser_id;

    console.log('id is ' + dser_id)

    db.query('delete from res_detalle_servicio where dser_id=$1', [dser_id], (error, results) => {
        if (error)
            throw error
        response.status(200).send(`deleted id is ${dser_id}`)
    })
}


const updateDetalleServicio = (request, response) => {
    const dser_id = request.params.dser_id;
    const { dser_evidencia, ser_id } = request.body
    console.log('id is ' + dser_id)

    db.query('update res_detalle_servicio set dser_evidencia=$1, ser_id=$2 where dser_id=$3', [dser_evidencia, ser_id, dser_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Tipo Servicio modified with ${dser_id}`)
    })
}


module.exports = {
    createDetalleServicio,
    getDetalleServicioById,
    getAllDetalleServicios,
    deleteDetalleServicio,
    updateDetalleServicio

}