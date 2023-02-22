const { response } = require("express")
const { db } = require("../Conexiones/slq")

const createReporte = (request, response) => {
    const { rep_total_cuotas, rep_total_alquileres, rep_total_multas, rep_total_gastos, rep_anio } = request.body

    db.query(`INSERT INTO cont_reporte (rep_total_cuotas,rep_total_alquileres,rep_total_multas,rep_total_gastos, rep_anio) 
    VALUES ($1,$2,$3,$4,$5)`, [rep_total_cuotas, rep_total_alquileres, rep_total_multas, rep_total_gastos,rep_anio], (error, results) => {
        if (error) {
            response.send(`{"status":"Error", "resp":"${error}"}`)

        }else{
            response.send(`{"status":"OK", "resp":"Reporte registrado exitosamente"}`)

        }
    })
}

const getAllReporte = (request, response) => {
    console.log("asada")
    db.query('SELECT * FROM cont_reporte ', (error, results) => {
        if (error) {
            console.log(error)
        } else {
            console.log("asada")

            response.status(200).json(results.rows)
        }

    })
}

const getReporteById = (request, response) => {
    const rep_id = request.params.rep_id;
    console.log('id is ' + rep_id)
    db.query('SELECT * FROM cont_reporte WHERE rep_id = $1', [rep_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const updateReporte = (request, response) => {
    const rep_id = request.params.rep_id;
    const { rep_total_cuotas, rep_total_alquileres, rep_total_multas, rep_total_gastos } = request.body
    console.log('id is ' + rep_id)

    db.query(`UPDATE cont_reporte SET rep_total_cuotas=$1, rep_total_alquileres=$2, rep_total_multas=$3, rep_total_gastos=$4 WHERE rep_id=$5`, [rep_total_cuotas, rep_total_alquileres, rep_total_multas, rep_total_gastos, rep_id], (error, results) => {
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
    db.query('DELETE from cont_reporte WHERE rep_id=$1', [rep_id], (error, results) => {
        if (error)
            throw error
        response.status(200).send(`Deleted id is ${rep_id}`)
    })
}



const getReporteCuotas = async (request, response) => {
    try {
        const dpag_fecha = request.params.dpag_fecha;
        const resultReservaciones = await db.query(`SELECT sum(total) as reservaciones
        FROM public.cont_detalle_pago
        WHERE date_part('year', dpag_fecha) = $1 and ali_id=1`, [dpag_fecha]);

        const resultCuotas = await db.query(`SELECT sum(total) as cuotas
        FROM public.cont_detalle_pago
        WHERE date_part('year', dpag_fecha) = $1 and ali_id!=1`, [dpag_fecha])

        const resultServicios = await db.query(`SELECT sum(ser_total) as servicios
        FROM res_servicio 
        WHERE date_part('year', ser_fecha) = $1`, [dpag_fecha])

        const resultMultas = await db.query(`SELECT sum(mul_total) as multas
        FROM cont_multa
        WHERE date_part('year', mul_fecha) = $1`, [dpag_fecha])
        console.log(resultReservaciones.rows[0].reservaciones)
        console.log(resultCuotas.rows[0].cuotas)
        console.log(resultServicios.rows[0].servicios)
        console.log(resultMultas.rows[0].multas)
        r = 0, c = 0, s = 0, m = 0;
        if (resultReservaciones.rows[0].reservaciones == null) {
            r = 0
        } else {
            r = resultReservaciones.rows[0].reservaciones;
        }
        if (resultCuotas.rows[0].cuotas == null) {
            c = 0
        } else {
            c = resultCuotas.rows[0].cuotas
        }
        if (resultServicios.rows[0].servicios == null) {
            s = 0
        }
        else {
            s = resultServicios.rows[0].servicios
        }
        if (resultMultas.rows[0].multas == null) {
            m = 0
        } else {
            m = resultMultas.rows[0].multas
        }

        response.send(`{"reservaciones":"${r}", "cuotas":"${c}",
        "servicios":"${s}","multas":"${m}"}`)

    } catch (error) {
        response.send(`{"status":"Error", "resp":"${error}"}`)

    }

}

const getReporteAlquileres = (request, response) => {
    const alq_fecha = request.params.alq_fecha;
    console.log('id is ' + alq_fecha)
    db.query('select sum(ra.alq_total) as alquileres from res_alquiler ra where extract (year from ra.alq_fecha) = $1', [alq_fecha], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getReporteMultas = (request, response) => {
    const mul_fecha = request.params.mul_fecha;
    console.log('id is ' + mul_fecha)
    db.query('select sum(cm.mul_total) as multas from cont_multa cm where extract (year from cm.mul_fecha) = $1', [mul_fecha], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getReporteGastos = (request, response) => {
    const ser_fecha = request.params.ser_fecha;
    console.log('id is ' + ser_fecha)
    db.query('select sum(rs.ser_total) as gastos from res_servicio rs where extract (year from rs.ser_fecha) = $1', [ser_fecha], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

module.exports = {
    createReporte,
    getAllReporte,
    getReporteById,
    updateReporte,
    deleteReporte,
    getReporteCuotas,
    getReporteAlquileres,
    getReporteMultas,
    getReporteGastos
}