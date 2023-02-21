const { response } = require("express")
const { db } = require("../Conexiones/slq")
const { decodeSign } = require("../Helpers/generateToken");

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

    db.query("select al.alq_id,al.alq_fecha,al.alq_hora_fin,al.alq_hora_inicio,al.alq_total, b.bien_descripcion, (pa.per_nombres || ' ' || pa.per_apellidos ) as condomino from res_alquiler al inner join gest_adm_bien b on b.bien_id=al.bien_id inner join seg_sis_residente r on r.res_id=al.res_id inner join seg_sis_persona pa on pa.per_id=r.per_id", (error, results) => {
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

const updateAlquiler = (request, res) => {
    const alq_id = request.params.alq_id;
    const { alq_fecha, alq_hora_inicio, res_id, bien_id, alq_hora_fin, alq_total } = request.body
    console.log('id is ' + alq_id)

    db.query(`UPDATE res_alquiler SET alq_fecha=$1, alq_hora_inicio=$2, res_id=$3,bien_id=$4, alq_hora_fin=$5, alq_total=$6 
    WHERE alq_id=$7`, [alq_fecha, alq_hora_inicio, res_id, bien_id, alq_hora_fin, alq_total, alq_id], (error, results) => {
        if (error) {

        } else {

        }


    })
}

const deleteAlquiler = (request, res) => {

    const alq_id = request.params.alq_id;
    console.log('id is ' + alq_id)
    db.query('DELETE from res_alquiler WHERE alq_id=$1', [alq_id], (error, results) => {
        if (error) {
            res.send(`{"status":"Error", "resp":"${error}"}`)
        } else {
            res.send(`{"status":"Ok", "resp":"Alquiler eliminado"}`)
        }

    })
}

//GET PAGO DE ALICUOTA
const getPagoAlicuota = async (request, response) => {
    const token = request.params.token;
    const per_id = await decodeSign(token, null)
    db.query("SELECT * FROM gest_adm_alicuota ORDER BY ali_id DESC LIMIT 1", (error, resA) => {
        if (error) {
            response.send(`{"status":"Error", "resp":"${error}"}`)
        } else {
            db.query("select res_id from seg_sis_residente where per_id=$1", [per_id._id], (error, resP) => {
                if (error) {
                    response.send(`{"status":"Error", "resp":"${error}"}`)
                } else {
                    db.query("Select * from cont_detalle_pago where res_id=$1 and ali_id=$2", [resP.rows[0].res_id, resA.rows[0].ali_id], (error, results) => {
                        if (error) {
                            response.send(`{"status":"Error", "resp":"${error}"}`)
                        } else {
                            response.status(200).json(results.rows[0])
                        }


                    })
                }
            })
        }
    })


}

const getPagoReservaciones = async (request, response) => {
    const token = request.params.token;
    const per_id = await decodeSign(token, null)
    db.query("select res_id from seg_sis_residente where per_id=$1", [per_id._id], (error, resP) => {
        if (error) {
            response.send(`{"status":"Error", "resp":"${error}"}`)
        } else {
            db.query("Select * from cont_detalle_pago where res_id=$1 and ali_id=1 and dpag_estado=false", [resP.rows[0].res_id], (error, results) => {
                if (error) {
                    response.send(`{"status":"Error", "resp":"${error}"}`)
                } else {
                    response.status(200).json(results.rows[0])
                }


            })
        }
    })




}
const getDetalleAlicuotaByID = (request, response) => {
    const ali_id = request.params.ali_id;

    db.query('select * from gest_adm_pago where ali_id=$1', [ali_id], (error, results) => {
        if (error) {
            response.send(`{"status":"Error", "resp":"${error}"}`)
        } else {
            response.json(results.rows)
        }

    })
}


const getResServicio = (request, response) => {

    db.query('select * from res_servicio', (error, results) => {
        if (error) {
            response.send(`{"status":"Error", "resp":"${error}"}`)
        } else {
            response.json(results.rows)
        }

    })
}

const getSumaResServicio = (request, response) => {

    db.query('select  sum(ser_total) as suma from res_servicio', (error, results) => {
        if (error) {
            response.send(`{"status":"Error", "resp":"${error}"}`)
        } else {
            response.json(results.rows[0])
        }

    })
}

const createVerificarAlquilerUsuarios = async (request, response) => {
    const { alq_fecha, alq_hora_inicio, token, bien_id, alq_hora_fin, alq_total } = request.body


    const horaInicio = new Date();
    horaInicio.setHours(parseInt(alq_hora_inicio.substr(0, 2)), parseInt(alq_hora_inicio.substr(3, 2)));
    const horaFin = new Date();
    horaFin.setHours(parseInt(alq_hora_fin.substr(0, 2)), parseInt(alq_hora_fin.substr(3, 2)));
    const duracionEnMilisegundos = horaFin.getTime() - horaInicio.getTime();
    const duracionEnHoras = Math.round(duracionEnMilisegundos / (1000 * 60 * 60));

    const per_id = await decodeSign(token, null)

    db.query("select res_id from seg_sis_residente where per_id=$1", [per_id._id], (error, resP) => {
        if (error) {
            response.send(`{"status":"Error", "resp":"${error}"}`)
        } else {
            db.query(`select * from cont_detalle_pago where dpag_estado=false and ali_id=1 and res_id=$1`
                , [resP.rows[0].res_id], async (error, resultspago) => {
                    console.log(resP.rows[0].res_id)
                    if (error) {
                        response.send(`{"status":"Error", "respa":"${error}"}`)
                    } else {
                        if (resultspago.rows == "") {
                            const resultAlquilerD = await db.query(`select * from gest_adm_bien where bien_id=$1`, [bien_id])
                            const resux = duracionEnHoras * resultAlquilerD.rows[0].bien_costo
                            response.send(`{"status":"Ok", "resp":"Su total es de: $${resux}, ¿desea continuar?"}`)

                        } else {
                           
                            response.send(`{"status":"Error", "resp":"Tiene un saldo pendiente de: $${resultspago.rows[0].total}, acerquese a cancelar. "}`)
                        }

                    }
                })
        }
    })

}


const createAlquilerUsuarios = async (request, response) => {
    const { alq_fecha, alq_hora_inicio, token, bien_id, alq_hora_fin } = request.body


    const horaInicio = new Date();
    horaInicio.setHours(parseInt(alq_hora_inicio.substr(0, 2)), parseInt(alq_hora_inicio.substr(3, 2)));
    const horaFin = new Date();
    horaFin.setHours(parseInt(alq_hora_fin.substr(0, 2)), parseInt(alq_hora_fin.substr(3, 2)));
    const duracionEnMilisegundos = horaFin.getTime() - horaInicio.getTime();
    const duracionEnHoras = Math.round(duracionEnMilisegundos / (1000 * 60 * 60));

    const per_id = await decodeSign(token, null)
    const resultAlquilerD = await db.query(`select * from gest_adm_bien where bien_id=$1`, [bien_id])
    const resux = duracionEnHoras * resultAlquilerD.rows[0].bien_costo



    db.query(`select * from res_alquiler where alq_fecha=$1 and bien_id=$2`, [alq_fecha, bien_id], async (error, resultsAlquiler) => {
        if (error) {
            response.send(`{"status":"Error", "resp":"${error}"}`)
        } else {

            if (resultsAlquiler.rows == "") {
                db.query("select res_id from seg_sis_residente where per_id=$1", [per_id._id], (error, resP) => {
                    if (error) {
                        response.send(`{"status":"Error", "resp":"${error}"}`)
                    } else {
                        const resux = duracionEnHoras * resultAlquilerD.rows[0].bien_costo
                        db.query(`INSERT INTO res_alquiler (alq_fecha,alq_hora_inicio,res_id,bien_id,alq_hora_fin,alq_total) VALUES ($1,$2,$3,$4,$5,$6)`
                            , [alq_fecha, alq_hora_inicio, resP.rows[0].res_id, bien_id, alq_hora_fin, resux], async (error, results) => {
                                if (error) {

                                } else {
                                    const resultAlquilerD = await db.query(`select * from gest_adm_bien where bien_id=$1`, [bien_id])
                                    const resux = duracionEnHoras * resultAlquilerD.rows[0].bien_costo
                                    db.query(`INSERT INTO cont_detalle_pago(
                                         dpag_fecha, res_id, dpag_estado, ali_id, total)
                                        VALUES ($1, $2, $3, $4, $5)`
                                        , [alq_fecha, resP.rows[0].res_id, false, 1, resux], async (error, results) => {
                                            if (error) {
                                                response.send(`{"status":"Error", "resp":"${error}"}`)
                                            } else {
                                                response.send(`{"status":"OK", "resp":"Reservación registrado exitosamente"}`)
                                            }
                                        })

                                }

                            })


                    }


                })
            } else {
                console.log(resultsAlquiler.rows)
                for (let i = 0; i < resultsAlquiler.rowCount; i++) {
                    // console.log(i)
                    const resultsHora = await db.query(`SELECT COUNT(*) AS num_reservas
                    FROM res_alquiler
                    WHERE (
                        CAST($1 AS TIME) BETWEEN alq_hora_inicio AND alq_hora_fin
                        OR CAST($2 AS TIME) BETWEEN alq_hora_inicio AND alq_hora_fin
                        OR alq_hora_inicio BETWEEN CAST($1 AS TIME) AND CAST($2 AS TIME)
                        OR alq_hora_fin BETWEEN CAST($1 AS TIME) AND CAST($2 AS TIME)
                    )
                    AND NOT (
                        alq_hora_inicio >= CAST($2 AS TIME) OR alq_hora_fin <= CAST($1 AS TIME)
                        
                        
                    
                    
    )`, [alq_hora_inicio, alq_hora_fin])

                    if (resultsHora.rows[0].num_reservas > 0) {

                        response.send(`{"status":"Error", "resp":"Ya se encuentra reservado."}`)
                        break
                    } else {
                        db.query("select res_id from seg_sis_residente where per_id=$1", [per_id._id], (error, resP) => {
                            if (error) {
                                response.send(`{"status":"Error", "resp":"${error}"}`)
                            } else {
                                const resux = duracionEnHoras * resultAlquilerD.rows[0].bien_costo
                                db.query(`INSERT INTO res_alquiler (alq_fecha,alq_hora_inicio,res_id,bien_id,alq_hora_fin,alq_total) VALUES ($1,$2,$3,$4,$5,$6)`
                                    , [alq_fecha, alq_hora_inicio, resP.rows[0].res_id, bien_id, alq_hora_fin, resux], async (error, results) => {
                                        if (error) {

                                        } else {
                                            const resultAlquilerD = await db.query(`select * from gest_adm_bien where bien_id=$1`, [bien_id])
                                            const resux = duracionEnHoras * resultAlquilerD.rows[0].bien_costo
                                            db.query(`INSERT INTO cont_detalle_pago(
                                                 dpag_fecha, res_id, dpag_estado, ali_id, total)
                                                VALUES ($1, $2, $3, $4, $5)`
                                                , [alq_fecha, resP.rows[0].res_id, false, 1, resux], async (error, results) => {
                                                    if (error) {
                                                        response.send(`{"status":"Error", "resp":"${error}"}`)
                                                    } else {
                                                        response.send(`{"status":"OK", "resp":"Reservación registrado exitosamente"}`)
                                                    }
                                                })

                                        }

                                    })


                            }


                        })
                    }
                    break
                }

            }


        }

        //   
    })
}


const getAllAlquileru = async (request, response) => {
    const token = request.params.token;
    const per_id = await decodeSign(token, null)
    db.query("select res_id from seg_sis_residente where per_id=$1", [per_id._id], (error, resP) => {
        if (error) {

        } else {
            db.query("select al.alq_id,al.alq_fecha,al.alq_hora_fin,al.alq_hora_inicio,al.alq_total, b.bien_descripcion, (pa.per_nombres || ' ' || pa.per_apellidos ) as condomino from res_alquiler al inner join gest_adm_bien b on b.bien_id=al.bien_id inner join seg_sis_residente r on r.res_id=al.res_id inner join seg_sis_persona pa on pa.per_id=r.per_id where r.res_id=$1", [resP.rows[0].res_id], (error, results) => {
                if (error) {
                    response.send(`{"status":"Error", "resp":"${error}"}`)
                } else {
                    response.status(200).json(results.rows)
                }

            })
        }
    })

}
////ALQUILERES
module.exports = {
    createAlquiler,
    getAllAlquiler,
    getAlquilerById,
    updateAlquiler,
    deleteAlquiler,
    getPagoAlicuota,
    getPagoReservaciones,
    getDetalleAlicuotaByID,
    getResServicio,
    getSumaResServicio,
    createAlquilerUsuarios,
    createVerificarAlquilerUsuarios,
    getAllAlquileru

}