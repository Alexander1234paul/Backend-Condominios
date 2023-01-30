const { response } = require("express")
const { db } = require("../Conexiones/slq")

const createDepartamento= (request, response) => {
    const {dep_id,res_id,dep_telefono,dep_estado,dep_ocupacion} = request.body

    db.query(`INSERT INTO departamento (dep_id,res_id,dep_telefono,dep_estado,dep_ocupacion) 
    VALUES ($1,$2,$3,$4,$5)`, [dep_id,res_id,dep_telefono,dep_estado,dep_ocupacion], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Departamento added with: ${dep_id,res_id,dep_telefono,dep_estado,dep_ocupacion}`)
    })
}

const getAllDepartamento = (request, response) => {

    db.query('SELECT * FROM departamento ', (error, results) => {
        if (error)
            throw error
        response.status(200).json(results.rows)
    })
}

const getDepartamentoById = (request, response) => {
    const dep_id = request.params.dep_id;
    console.log('id is ' + dep_id)
    db.query('SELECT * FROM departamento WHERE dep_id = $1', [dep_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const updateDepartamento = (request, response) => {
    const dep_id = request.params.dep_id;
    const {res_id,dep_telefono,dep_estado,dep_ocupacion} = request.body
    console.log('id is ' + dep_id)

    db.query(`UPDATE departamento SET res_id=$1, dep_telefono=$2, dep_estado=$3, dep_ocupacion=$4 WHERE dep_id=$5`, [res_id,dep_telefono,dep_estado,dep_ocupacion,dep_id], (error, results) => {
        if (error) {
            throw error
            console.log(error)
        }
        
        response.status(200).send(`Departamento modified with ${dep_id}`)
    })
}

const deleteDepartamento = (request, response) => {

    const dep_id = request.params.dep_id;
    console.log('id is ' + dep_id)
    db.query('DELETE from departamento WHERE dep_id=$1', [dep_id], (error, results) => {
        if (error)
            throw error
        response.status(200).send(`Deleted id is ${dep_id}`)
    })
}


module.exports = {
    createDepartamento,
    getAllDepartamento,
    getDepartamentoById,
    updateDepartamento,
    deleteDepartamento

}