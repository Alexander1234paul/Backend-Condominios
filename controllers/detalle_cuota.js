const { response } = require("express")
const { db } = require("../Conexiones/slq")

const getAllDCuota = (request, response) => {

    db.query('select * from detalle_cuota order by dcuo_id', (error, results) => {
        if (error)
            throw error
        response.status(200).json(results.rows)
    })
}

const getByDCuota = (request, response) => {

    const dcuo_id = request.params.dcuo_id;

    console.log('id' + dcuo_id)
    db.query('SELECT * FROM detalle_cuota WHERE dcuo_id = $1', [dcuo_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createDCuota = (request, response) => {
    const { dcuo_id, dcuo_fecha, res_id, dcuo_estado, cuo_id } = request.body

    db.query('INSERT INTO detalle_cuota (dcuo_id, dcuo_fecha, res_id, dcuo_estado, cuo_id) VALUES ($1, $2, $3, $4, $5)', [dcuo_id, dcuo_fecha, res_id, dcuo_estado, cuo_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Detalle cuota added with ID: ${dcuo_id}`)
    })
}

const updateDCuota = (request, response) => {
    const dcuo_id = request.params.dcuo_id;
    const { dcuo_fecha, res_id, dcuo_estado, cuo_id } = request.body
    console.log('id' + dcuo_id)

    db.query('update detalle_cuota set dcuo_fecha=$2, res_id=$3, dcuo_estado=$4, cuo_id=$5 where dcuo_id=$1', [ dcuo_fecha, res_id, dcuo_estado, cuo_id, dcuo_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Detalle cuota modified with ${mul_id}`)
    })
}

const deleteDCuota = (request, response) => {

    const dcuo_id = request.params.dcuo_id;

    console.log('id' + dcuo_id)

    db.query('delete from detalle_cuota where dcuo_id=$1', [dcuo_id], (error, results) => {
        if (error)
            throw error
        response.status(200).send(`Delete id ${dcuo_id}`)
    })
}

module.exports = {
    getAllDCuota,
    getByDCuota,
    createDCuota,
    updateDCuota,
    deleteDCuota

}