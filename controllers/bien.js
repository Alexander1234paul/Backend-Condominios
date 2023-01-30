const { response } = require("express")
const { db } = require("../Conexiones/slq")

const createBien= (request, response) => {
    const {bien_descripcion,bien_costo} = request.body

    db.query(`INSERT INTO bien (bien_descripcion,bien_costo) 
    VALUES ($1,$2)`, [bien_descripcion,bien_costo], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Bien added with: ${bien_descripcion,bien_costo}`)
    })
}

const getAllBien = (request, response) => {

    db.query('SELECT * FROM bien ', (error, results) => {
        if (error)
            throw error
        response.status(200).json(results.rows)
    })
}

const getBienById = (request, response) => {
    const bien_id = request.params.bien_id;
    console.log('id is ' + bien_id)
    db.query('SELECT * FROM bien WHERE bien_id = $1', [bien_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const updateBien = (request, response) => {
    const bien_id = request.params.bien_id;
    const {bien_descripcion,bien_costo} = request.body
    console.log('id is ' + bien_id)

    db.query(`UPDATE bien SET bien_descripcion=$1, bien_costo=$2 WHERE bien_id=$3`, [bien_descripcion,bien_costo,bien_id], (error, results) => {
        if (error) {
            throw error
        }
        
        response.status(200).send(`Bien modified with ${bien_id}`)
    })
}

const deleteBien = (request, response) => {

    const bien_id = request.params.bien_id;
    console.log('id is ' + bien_id)
    db.query('DELETE from bien WHERE bien_id=$1', [bien_id], (error, results) => {
        if (error)
            throw error
        response.status(200).send(`Deleted id is ${bien_id}`)
    })
}


module.exports = {
    createBien,
    getAllBien,
    getBienById,
    updateBien,
    deleteBien

}