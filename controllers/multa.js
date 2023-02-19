const { response } = require("express")
const { db } = require("../Conexiones/slq")

const getAllMulta = (request, response) => {

    db.query('SELECT (pe.per_apellidos, pe.per_nombres) as residente, ml.mul_descripcion, mo.mon_precio, ml.mul_fecha, ml.mul_estado  FROM cont_multa ml, gest_adm_monto mo, seg_sis_residente r, seg_sis_persona pe where ml.mon_id = mo.mon_id and ml.mul_estado = false and ml.res_id = r.res_id and r.per_id = pe.per_id order by ml.mul_id', (error, results) => {
        if (error)
            throw error
        response.status(200).json(results.rows)
    })
}

const getByMulta = (request, response) => {

    const mul_id = request.params.mul_id;

    console.log('id' + mul_id)
    db.query('SELECT * FROM cont_multa WHERE mul_id = $1', [mul_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createMulta = (request, response) => {
    const {mon_id, res_id, mul_estado, mul_fecha, mul_descripcion, mul_total } = request.body

    db.query('INSERT INTO cont_multa (mon_id, res_id, mul_estado, mul_fecha, mul_descripcion, mul_total) VALUES ($1, $2, $3, $4, $5, $6)', [mon_id, res_id, mul_estado, mul_fecha, mul_descripcion, mul_total], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Multa added with ID: ${res_id}`)
    })
}

const updateMulta = (request, response) => {
    const mul_id = request.params.mul_id;
    const { mon_id, res_id, mul_estado, mul_fecha, mul_descripcion, mul_total } = request.body
    console.log('id' + mul_id)

    db.query('update cont_multa set mon_id=$2, res_id=$3, mul_estado=$4, mul_fecha=$5, mul_descripcion=$6, mul_total=$7 where mul_id=$1', [mon_id, res_id, mul_estado, mul_fecha, mul_descripcion, mul_total, mul_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Multa modified with ${mul_id}`)
    })
}

const pagarMulta = (request, response) => {
    const mul_id = request.params.mul_id;
    const { mul_estado, mul_total } = request.body
    console.log('id' + mul_id)

    db.query('update cont_multa set mul_estado=true, mul_total=0 where mul_id=$1', [mul_estado, mul_total], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Multa modified with ${mul_id}`)
    })
}

const deleteMulta = (request, response) => {

    const mul_id = request.params.mul_id;

    //console.log('id' + mul_id)

    db.query('delete from cont_multa where mul_id=$1', [mul_id], (error, results) => {
        if (error)
            throw error
        response.status(200).send(`Delete id is ${mul_id}`)
    })
}

module.exports = {
    getAllMulta,
    getByMulta,
    createMulta,
    updateMulta,
    deleteMulta,
    pagarMulta

}