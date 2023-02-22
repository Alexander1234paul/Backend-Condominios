const { response } = require("express")
const { db } = require("../Conexiones/slq")

const createDepartamento= async (request, response) => {
    const {dep_id,res_id,dep_telefono,dep_estado,dep_ocupacion} = request.body

    db.query(`INSERT INTO gest_adm_departamento (dep_id,dep_telefono,dep_estado,dep_ocupacion) 
    VALUES ($1,$2,$3,$4)`, [dep_id,dep_telefono,dep_estado,dep_ocupacion], (error, results) => {
        if (error) {
            // throw error
            response.status(400).send(`{}`)
        } else {
            response.status(201).send(`{}`)
        }
    })
}

const getAllDepartamento = (request, response) => {

    db.query('SELECT * FROM gest_adm_departamento ', (error, results) => {
        if (error) {
            response.status(201).send(`Bien added with:`)
        } else {
            response.status(200).json(results.rows)
        }
    })
}

const getDepartamentoById = (request, response) => {
    const dep_id = request.params.dep_id;
    console.log('id is ' + dep_id)
    db.query('SELECT * FROM gest_adm_departamento WHERE dep_id = $1', [dep_id], (error, results) => {
        if (error) {
            // throw error
            response.status(400).send(`{}`)
        } else {
            response.status(201).send(`{}`)
        }
    })
}

const updateDepartamento = (request, response) => {
    const dep_id = request.params.dep_id;
    const {dep_telefono,dep_estado,dep_ocupacion} = request.body
    console.log('id is ' + dep_id)

    db.query(`UPDATE gest_adm_departamento SET dep_telefono=$1, dep_estado=$2, dep_ocupacion=$3 WHERE dep_id=$4`, [dep_telefono,dep_estado,dep_ocupacion,dep_id], (error, results) => {
        if (error) {
            // throw error
            response.status(400).send(`{}`)
        } else {
            response.status(201).send(`{}`)
        }
    })
}

const deleteDepartamento = (request, response) => {

    const dep_id = request.params.dep_id;
    // console.log('id is ' + dep_id)
    db.query('DELETE from gest_adm_departamento WHERE dep_id=$1', [dep_id], (error, results) => {
        if (error) {
            // throw error
            response.status(400).send(`{}`)
        } else {
            response.status(201).send(`{}`)
        }
    })
}


module.exports = {
    createDepartamento,
    getAllDepartamento,
    getDepartamentoById,
    updateDepartamento,
    deleteDepartamento

}