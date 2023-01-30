const { response } = require("express")
const { db } = require("../Conexiones/slq")

const getAllMulta = (request, response) => {

    db.query('select * from multa order by mul_id', (error, results) => {
        if (error)
            throw error
        response.status(200).json(results.rows)
    })
}

const getByMulta = (request, response) => {

    const mul_id = request.params.mul_id;

    console.log('id' + mul_id)
    db.query('SELECT * FROM multa WHERE mul_id = $1', [mul_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createMulta = (request, response) => {
    const { mul_id, mon_id, dcuo_id, mul_estado, mul_fecha } = request.body

    db.query('INSERT INTO multa (mul_id, mon_id, dcuo_id, mul_estado, mul_fecha) VALUES ($1, $2, $3, $4, $5)', [mul_id, mon_id, dcuo_id, mul_estado, mul_fecha], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Multa added with ID: ${mul_id}`)
    })
}

const updateMulta = (request, response) => {
    const mul_id = request.params.mul_id;
    const { mon_id, dcuo_id, mul_estado, mul_fecha } = request.body
    console.log('id' + mul_id)

    db.query('update multa set mon_id=$2, dcuo_id=$3, mul_estado=$4, mul_fecha=$5 where mul_id=$1', [mon_id, dcuo_id, mul_estado, mul_fecha, mul_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Multa modified with ${mul_id}`)
    })
}

const deleteMulta = (request, response) => {

    const mul_id = request.params.mul_id;

    console.log('id' + mul_id)

    db.query('delete from multa where mul_id=$1', [mul_id], (error, results) => {
        if (error)
            throw error
        response.status(200).send(`Delete id ${mul_id}`)
    })
}

module.exports = {
    getAllMulta,
    getByMulta,
    createMulta,
    updateMulta,
    deleteMulta

}