const { response } = require("express")
const { db } = require("../Conexiones/slq")

const createServicio = (request, response) => {
    const { ser_fecha, ser_descripcion, ser_total, tser_id } = request.body

    db.query('INSERT INTO res_servicio (ser_fecha, ser_descripcion, ser_total, tser_id ) VALUES ($1,$2,$3,$4)', [ser_fecha, ser_descripcion, ser_total, tser_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Servicio added with: ${ser_fecha, ser_descripcion, ser_total, tser_id }`)
    })
}

const getServicioById = (request, response) => {

    const ser_id = request.params.ser_id;

    console.log('id is ' + ser_id)
    db.query('SELECT * FROM res_servicio WHERE ser_id = $1', [ser_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}


const getAllServicios = (request, response) => {

    db.query('select * from res_servicio ', (error, results) => {
        if (error)
            throw error
        response.status(200).json(results.rows)
    })
}


const deleteServicio = (request, response) => {

    const ser_id = request.params.ser_id;

    console.log('id is ' + ser_id)

    db.query('delete from res_servicio where ser_id=$1', [ser_id], (error, results) => {
        if (error)
            throw error
        response.status(200).send(`deleted id is ${ser_id}`)
    })
}


const updateServicio = (request, response) => {
    const ser_id = request.params.ser_id;
    const { ser_fecha, ser_descripcion, ser_total, tser_id } = request.body
    console.log('id is ' + ser_id)

    db.query('update res_servicio set ser_fecha=$1, ser_descripcion=$2, ser_total=$3, tser_id=$4 where ser_id=$5', [ser_fecha, ser_descripcion, ser_total, tser_id, ser_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Tipo Servicio modified with ${ser_id}`)
    })
}


module.exports = {
    createServicio,
    getServicioById,
    getAllServicios,
    deleteServicio,
    updateServicio

}