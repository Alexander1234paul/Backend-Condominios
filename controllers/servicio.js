const { response } = require("express")
const { db } = require("../Conexiones/slq")

const createServicio = (request, response) => {
    const { ser_fecha, ser_descripcion, ser_total, tser_id } = request.body

    db.query('INSERT INTO res_servicio (ser_fecha, ser_descripcion, ser_total, tser_id ) VALUES ($1,$2,$3,$4)', [ser_fecha, ser_descripcion, ser_total, tser_id], (error, results) => {
        if (error) {
            throw error
        }
        response.send(`{"status":"Ok", "resp":"Tipo Servicio added with ID: ${ser_descripcion}"}`)
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

    db.query('SELECT ser_id, ser_fecha, ser_descripcion, ser_total, tser_descripcion FROM res_servicio s INNER JOIN gest_adm_tipo_servicio ts on ts.tser_id = s.tser_id', (error, results) => {
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
        response.send(`{"status":"Ok", "resp":"deleted id is ${ser_id}"}`)
    })
}


const updateServicio = (request, response) => {
    const ser_id = request.params.ser_id;
    const { ser_fecha, ser_descripcion, ser_total, tser_id } = request.body
    console.log('id is ' + ser_id)

    db.query('update res_servicio set ser_fecha=$1, ser_descripcion=$2, ser_total=$3, tser_id=$4 where ser_id=$5', [ser_fecha, ser_descripcion, ser_total, tser_id, ser_id], (error, results) => {
        if (error) {
            response.send(`{"status":"Error", "resp":${error}}`)
        } else {
            response.send(`{"status":"Ok", "resp":"Asignación correcta"}`)
        }
    })
}


module.exports = {
    createServicio,
    getServicioById,
    getAllServicios,
    deleteServicio,
    updateServicio

}