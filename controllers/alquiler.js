const { response } = require("express")
const { db } = require("../Conexiones/slq")

const createAlquiler = (request, response) => {
    const { alq_fecha, alq_hora_inicio, res_id, bien_id, alq_hora_fin, alq_total } = request.body

    db.query(`INSERT INTO res_alquiler (alq_fecha,alq_hora_inicio,res_id,bien_id,alq_hora_fin,alq_total) 
    VALUES ($1,$2,$3,$4,$5,$6)`, [alq_fecha, alq_hora_inicio, res_id, bien_id, alq_hora_fin, alq_total], (error, results) => {
        if (error) {
            response.send(`{"status":"Error", "resp":"${error}"}`)
        }
        response.send(`{"status":"OK", "resp":"Alquiler registrado exitosamente"}`)
    })
}

const getAllAlquiler = (request, response) => {

    db.query("select al.alq_fecha,al.alq_hora_fin,al.alq_hora_inicio,al.alq_total, b.bien_descripcion, (pa.per_nombres || ' ' || pa.per_apellidos ) as condomino from res_alquiler al inner join gest_adm_bien b on b.bien_id=al.bien_id inner join seg_sis_residente r on r.res_id=al.res_id inner join seg_sis_persona pa on pa.per_id=r.per_id", (error, results) => {
        if (error)
            throw error
        response.status(200).json(results.rows)
    })
}


const getAlquilerById = (request, response) => {
    const alq_id = request.params.alq_id;
    console.log('id is ' + alq_id)
    db.query('SELECT * FROM res_alquiler WHERE alq_id = $1', [alq_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const updateAlquiler = (request, response) => {
    const alq_id = request.params.alq_id;
    const { alq_fecha, alq_hora_inicio, res_id, bien_id, alq_hora_fin, alq_total } = request.body
    console.log('id is ' + alq_id)

    db.query(`UPDATE res_alquiler SET alq_fecha=$1, alq_hora_inicio=$2, res_id=$3,bien_id=$4, alq_hora_fin=$5, alq_total=$6 
    WHERE alq_id=$7`, [alq_fecha, alq_hora_inicio, res_id, bien_id, alq_hora_fin, alq_total, alq_id], (error, results) => {
        if (error) {
            throw error
        }

        response.status(200).send(`Alquiler modified with ${alq_id}`)
    })
}

const deleteAlquiler = (request, response) => {

    const alq_id = request.params.alq_id;
    console.log('id is ' + alq_id)
    db.query('DELETE from res_alquiler WHERE alq_id=$1', [alq_id], (error, results) => {
        if (error)
            throw error
        response.status(200).send(`Deleted id is ${alq_id}`)
    })
}


module.exports = {
    createAlquiler,
    getAllAlquiler,
    getAlquilerById,
    updateAlquiler,
    deleteAlquiler

}