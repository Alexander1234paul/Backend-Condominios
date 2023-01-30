const { response } = require("express")
const { db } = require("../Conexiones/slq")

const createReporte= (request, response) => {
    const {rep_total_cuotas,rep_total_alquileres,rep_total_multas,rep_total_gastos} = request.body

    db.query(`INSERT INTO reporte (rep_total_cuotas,rep_total_alquileres,rep_total_multas,rep_total_gastos) 
    VALUES ($1,$2,$3,$4)`, [rep_total_cuotas,rep_total_alquileres,rep_total_multas,rep_total_gastos], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Reporte added with: ${rep_total_cuotas,rep_total_alquileres,rep_total_multas,rep_total_gastos}`)
    })
}

const getAllReporte = (request, response) => {

    db.query('SELECT * FROM reporte ', (error, results) => {
        if (error)
            throw error
        response.status(200).json(results.rows)
    })
}

const getReporteById = (request, response) => {
    const rep_id = request.params.rep_id;
    console.log('id is ' + rep_id)
    db.query('SELECT * FROM reporte WHERE rep_id = $1', [rep_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const updateReporte = (request, response) => {
    const rep_id = request.params.rep_id;
    const {rep_total_cuotas,rep_total_alquileres,rep_total_multas,rep_total_gastos} = request.body
    console.log('id is ' + rep_id)

    db.query(`UPDATE reporte SET rep_total_cuotas=$1, rep_total_alquileres=$2, rep_total_multas=$3, rep_total_gastos=$4 WHERE rep_id=$5`, [rep_total_cuotas,rep_total_alquileres,rep_total_multas,rep_total_gastos,rep_id], (error, results) => {
        if (error) {
            throw error
            console.log(error)
        }
        
        response.status(200).send(`Reporte modified with ${rep_id}`)
    })
}

const deleteReporte = (request, response) => {

    const rep_id = request.params.rep_id;
    console.log('id is ' + rep_id)
    db.query('DELETE from reporte WHERE rep_id=$1', [rep_id], (error, results) => {
        if (error)
            throw error
        response.status(200).send(`Deleted id is ${rep_id}`)
    })
}


module.exports = {
    createReporte,
    getAllReporte,
    getReporteById,
    updateReporte,
    deleteReporte

}