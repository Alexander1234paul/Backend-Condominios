const { response } = require("express")
const { db } = require("../Conexiones/slq")

const getAllMulta = (request, response) => {

    db.query("SELECT ml.mul_id, concat(pe.per_apellidos ||' ' || pe.per_nombres) as residente, ml.mul_descripcion, ml.mul_total, ml.mul_fecha, ml.mul_estado  FROM cont_multa ml, gest_adm_monto mo, seg_sis_residente r, seg_sis_persona pe where ml.mon_id = mo.mon_id and ml.mul_estado = false and ml.res_id = r.res_id and r.per_id = pe.per_id order by ml.mul_id", (error, results) => {
        if (error) {
            //throw error
            response.status(400).send(`{}`)
        } else {
            response.status(201).json(results.rows)
        }
    })
}

const getByMulta = (request, response) => {

    const mul_id = request.params.mul_id;

    console.log('id' + mul_id)
    db.query('SELECT * FROM cont_multa WHERE mul_id = $1', [mul_id], (error, results) => {
        if (error) {
            //throw error
            response.status(400).send(`{}`)
        } else {
            response.status(201).json(results.rows[0])
        }
    })
}

const getResidenteM = (request, response) => {


    db.query("SELECT (p.per_nombres || ' ' || p.per_apellidos) as residente, r.res_id FROM seg_sis_residente r inner join seg_sis_persona p on p.per_id = r.per_id", (error, results) => {
        if (error) {
            response.status(400).send(`{}`)
        } else {
            response.status(201).json(results.rows)
        }
    })
}

const createMulta = (request, response) => {
    const { res_id, mul_descripcion, mul_total } = request.body
    console.log(res_id, mul_descripcion, mul_total)

    db.query('INSERT INTO cont_multa (mon_id, res_id, mul_estado, mul_fecha, mul_descripcion, mul_total) VALUES (1, $1, false, current_date, $2, $3)', [res_id, mul_descripcion, mul_total], (error, results) => {
        if (error) {

            response.send(`{"status":"Error", "resp":"${error}"}`)
        } else {
            response.send(`{"status":"OK", "resp":"Multa registrada exitosamente"}`)

        }
    })
}

const updateMulta = (request, response) => {
    const mul_id = request.params.mul_id;
    const { mon_id, res_id, mul_estado, mul_fecha, mul_descripcion, mul_total } = request.body
    console.log('id' + mul_id)

    db.query('update cont_multa set mon_id=$2, res_id=$3, mul_estado=$4, mul_fecha=$5, mul_descripcion=$6, mul_total=$7 where mul_id=$1', [mon_id, res_id, mul_estado, mul_fecha, mul_descripcion, mul_total, mul_id], (error, results) => {
        if (error) {
            //throw error
            response.status(400).send(`{}`)
        } else {
            response.status(201).send(`{}`)
        }
    })
}

const pagarMulta = (request, response) => {
    const mul_id = request.params.mul_id;
    const { mul_estado, mul_total } = request.body
    console.log('id' + mul_id)

    db.query('update cont_multa set mul_estado=true, mul_total=0 where mul_id=$1', [mul_estado, mul_total], (error, results) => {
        if (error) {
            //throw error
            response.status(400).send(`{}`)
        } else {
            response.status(201).send(`{}`)
        }
    })
}

const deleteMulta = (request, response) => {

    const mul_id = request.params.mul_id;

    db.query('delete from cont_multa where mul_id=$1', [mul_id], (error, results) => {
        if (error) {
            //throw error
            response.send(`{"status":"Error", "resp":"${error}"}`)
        } else {
            response.send(`{"status":"OK", "resp":"Multa eliminada exitosamente"}`)
        }
    })
}

const verificarMulta = (request, response) => {

    const fechaActual = new Date();
    const diaActual = fechaActual.getDate();

    db.query("SELECT  dp.*, DATE_PART('day', dp.dpag_fecha) AS dia_pago FROM public.cont_detalle_pago dp where ali_id!=1 and dpag_estado=false", (error, results) => {
        if (error) {

            response.send(`{"status":"Error", "resp":"${error}"}`)
        } else {
            // console.log(results.rows[0].dia_pago)
            if (diaActual + 1 == results.rows[0].dia_pago + 1) {
            db.query("SELECT dp.*, EXTRACT(YEAR FROM age(now(), dp.dpag_fecha)) * 12 +  EXTRACT(MONTH FROM age(now(), dp.dpag_fecha)) AS meses_retraso FROM public.cont_detalle_pago dp WHERE dp.dpag_fecha < now() - interval '1 month' and ali_id!=1 and dpag_estado=false ORDER BY dp.dpag_fecha DESC", async (error, results) => {
                if (error) {
                    response.send(`{"status":"Error", "resp":"${error}"}`)
                } else {
                    if (results.rows == "") {
                        response.send(`{"status":"OK", "resp":"Multa eliminada exitosamente"}`)

                    } else {
                        const resultMontoD = await db.query(`SELECT * FROM gest_adm_monto ORDER BY mon_id DESC LIMIT 1;`)
                        for (var i = 0; i < results.rowCount; i++) {
                            if (results.rows[i].meses_retraso > 1) {
                                await db.query('INSERT INTO cont_multa (mon_id, res_id, mul_estado, mul_fecha, mul_descripcion, mul_total) VALUES ($4, $1, false, current_date, $2, $3)', [results.rows[i].res_id, 'Multa por atraso de alicuota', resultMontoD.rows[0].mon_precio, resultMontoD.rows[0].mon_id])
                            }
                        }
                        response.send(`{"status":"OK", "resp":"Ok"}`)
                    }
                }

            })
            } else {
                response.send(`{"status":"OK", "resp":"OK"}`)
            }

        }
    })
}

module.exports = {
    getAllMulta,
    getByMulta,
    createMulta,
    updateMulta,
    deleteMulta,
    pagarMulta,
    getResidenteM,
    verificarMulta

}