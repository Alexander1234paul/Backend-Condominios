const { response } = require("express")
const { db } = require("../Conexiones/slq")

const getAllCuota = (request, response) => {

    db.query('select * from gest_adm_pago order by cuo_id', (error, results) => {
        if (error)
            throw error
        response.status(200).json(results.rows)
    })
}

const getByCuota = (request, response) => {

    const cuo_id = request.params.cuo_id;

    console.log('id' + cuo_id)
    db.query('SELECT * FROM gest_adm_pago WHERE cuo_id = $1', [cuo_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createCuota = (request, response) => {
    const { cuo_id, cuo_descripcion, cuo_costo } = request.body

    db.query('INSERT INTO gest_adm_pago (cuo_id, cuo_descripcion, cuo_costo) VALUES ($1, $2, $3)', [cuo_id, cuo_descripcion, cuo_costo], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Cuota added with ID: ${cuo_id}`)
    })
}

const updateCuota = (request, response) => {
    const cuo_id = request.params.cuo_id;
    const { cuo_descripcion, cuo_costo } = request.body
    console.log('id' + cuo_id)

    db.query('update gest_adm_pago set cuo_descripcion=$1, cuo_costo=$2 where cuo_id=$3', [cuo_descripcion, cuo_costo, cuo_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Cuota modified with ${cuo_id}`)
    })
}

const deleteCuota = (request, response) => {

    const cuo_id = request.params.cuo_id;

    console.log('id' + cuo_id)

    db.query('delete from gest_adm_pago where cuo_id=$1', [cuo_id], (error, results) => {
        if (error)
            throw error
        response.status(200).send(`Delete id ${cuo_id}`)
    })
}

module.exports = {
    getAllCuota,
    getByCuota,
    createCuota,
    updateCuota,
    deleteCuota

}