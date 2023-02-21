const { response } = require("express")
const { db } = require("../Conexiones/slq")

const createBien = (request, response) => {
    const { bien_descripcion, bien_costo } = request.body
    console.log("nasjndj")
    db.query(`INSERT INTO gest_adm_bien (bien_descripcion,bien_costo) 
    VALUES ($1,$2)`, [bien_descripcion, bien_costo], (error, results) => {
        if (error) {
            // throw error
            response.status(400).send(`{}`)
        } else {
            response.status(201).send(`{}`)
        }

    })
}

const getAllBien = async (request, response) => {

    await db.query('SELECT * FROM gest_adm_bien', (error, results) => {
        if (error) {
            response.status(201).send(`Bien added with:`)
        } else {
            response.status(200).json(results.rows)
        }
        

    })
}

const getBienById = (request, response) => {
    const bien_id = request.params.bien_id;
    console.log('id is ' + bien_id)
    db.query('SELECT * FROM gest_adm_bien WHERE bien_id = $1', [bien_id], (error, results) => {
        if (error) {
            // throw error
            response.status(400).send(`{}`)
        } else {
            response.status(201).send(`{}`)
        }
    })
}

const updateBien = (request, response) => {
    const bien_id = request.params.bien_id;
    const { bien_descripcion, bien_costo } = request.body
    console.log('id is ' + bien_id)

    db.query(`UPDATE gest_adm_bien SET bien_descripcion=$1, bien_costo=$2 WHERE bien_id=$3`, [bien_descripcion, bien_costo, bien_id], (error, results) => {
        if (error) {
            // throw error
            response.status(400).send(`{}`)
        } else {
            response.status(201).send(`{}`)
        }
    })
}

const deleteBien = (request, response) => {

    const bien_id = request.params.bien_id;
    console.log('id is ' + bien_id)
    db.query('DELETE from gest_adm_bien WHERE bien_id=$1', [bien_id], (error, results) => {
        if (error) {
            // throw error
            response.status(400).send(`{}`)
        } else {
            response.status(201).send(`{}`)
        }
    })
}


module.exports = {
    createBien,
    getAllBien,
    getBienById,
    updateBien,
    deleteBien

}