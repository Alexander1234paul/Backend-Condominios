const { response } = require("express")
const { db } = require("../Conexiones/slq")

const getAllMonto = (request, response) => {

    db.query('SELECT * FROM gest_adm_monto order by mon_id', (error, results) => {
        if (error) {
            //throw error
            response.status(400).send(`{}`)
        } else {
            response.status(201).json(results.rows)
        }
    })
}

const getByMonto = (request, response) => {

    const mon_id = request.params.mon_id;
    db.query(`select * from gest_adm_monto WHERE mon_id = $1`, [mon_id], (error, results) => {
        if (error) {
            //throw error
            response.status(400).send(`{}`)
        } else {
            response.status(201).json(results.rows[0])
        }
    })
}

const createMonto = (request, response) => {
    const { mon_precio } = request.body

    db.query(`INSERT INTO gest_adm_monto (mon_precio, mon_fecha) VALUES ($1, current_date)`, [mon_precio], (error, results) => {
        if (error) {
            //throw error
            response.status(400).send(`{}`)
        } else {
            response.status(201).send(`{}`)
        }
    })
}

const updateMonto = (request, response) => {
    const mon_id = request.params.mon_id;
    const { mon_precio } = request.body
    console.log('id' + mon_id)

    db.query(`update gest_adm_monto set  mon_precio=$1 where mon_id=$2`, [mon_precio, mon_id], (error, results) => {
        if (error) {
            //throw error
            response.status(400).send(`{}`)
        } else {
            response.status(201).send(`{}`)
        }
    })
}

const deleteMonto = (request, response) => {

    const mon_id = request.params.mon_id;
    db.query(`delete from gest_adm_monto where mon_id=$1`, [mon_id], (error, results) => {
        if (error) {
            //throw error
            response.status(400).send(`{}`)
        } else {
            response.status(201).send(`{}`)
        }
    })
}

module.exports = {
    getAllMonto,
    getByMonto,
    createMonto,
    updateMonto,
    deleteMonto

}