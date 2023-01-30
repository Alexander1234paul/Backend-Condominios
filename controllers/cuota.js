const { response } = require("express")
const { db } = require("../Conexiones/slq")

const getAllCuota = (request, response) => {

    db.query('select * from cuota order by cuo_id', (error, results) => {
        if (error)
            throw error
        response.status(200).json(results.rows)
    })
}

const getByCuota = (request, response) => {

    const cuo_id = request.params.cuo_id;

    console.log('id' + cuo_id)
    db.query('SELECT * FROM cuota WHERE cuo_id = $1', [cuo_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createCuota = (request, response) => {
    const { cuo_id, cuo_descripcion, cuo_costo } = request.body

    db.query('INSERT INTO cuota (cuo_id, cuo_descripcion, cuo_costo) VALUES ($1, $2, $3)', [cuo_id, cuo_descripcion, cuo_costo], (error, results) => {
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

    db.query('update cuota set cuo_descripcion=$2, cuo_costo=$3 where cuo_id=$1', [cuo_descripcion, cuo_costo, cuo_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Cuota modified with ${cuo_id}`)
    })
}

const deleteCuota = (request, response) => {

    const cuo_id = request.params.cuo_id;

    console.log('id' + cuo_id)

    db.query('delete from cuota where cuo_id=$1', [cuo_id], (error, results) => {
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