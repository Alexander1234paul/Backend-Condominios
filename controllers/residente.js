const { response } = require("express")
const { db } = require("../Conexiones/slq")
const { encrypt } = require("../Helpers/handleBcrypt")

const createResidente = async (request, response) => {

    const { per_id, per_nombres, per_apellidos, res_correo, res_telefono, res_usuario, res_clave, accion, departamento_id } = request.body
    // console.log(per_id, per_nombres, per_apellidos, res_correo, res_telefono, res_usuario, res_clave, accion, departamento_id)

    const password = await encrypt(res_clave);

    //PROCESO SI EXISTE PERSONA Busca con la cedula si la persona ya existe
    db.query('select per_nombres, per_apellidos from seg_sis_persona WHERE per_id = $1', [per_id], (error, results) => {
        //si la persona no exise
        if (results.rows == "") {
            // crea la persona
            db.query('INSERT INTO seg_sis_persona (per_id, per_nombres,per_apellidos ) VALUES ($1, $2, $3)', [per_id, per_nombres, per_apellidos], (error, results) => {
                if (error) {
                    response.send(`{"status":"Error", "resp":"${error}"}`)

                } else {
                    //CONDICION PARA SABER SI ES CONDOMINO O HABITANTE
                    if (accion == 'true') {
                        //inserta un residente
                        db.query('INSERT INTO seg_sis_residente (res_correo, res_telefono, res_usuario, res_clave, rol_id, per_id, dep_id) VALUES ($1, $2, $3, $4, $5, $6,$7)', [res_correo, res_telefono, res_usuario, password, 6, per_id, departamento_id], (error, results) => {
                            if (error) {
                                response.send(`{"status":"Error", "resp":${error}}`)
                            } else {

                                //un vez insertado el residente se procese  a obtener el numero de personas
                                //que estan listadas en el departamento
                                db.query('select count(dep_id) as resp from seg_sis_residente where dep_id=dep_id and dep_id=$1', [departamento_id], (error, results) => {
                                    if (error) {
                                        response.send(`{"status":"Error", "resp":${error}}`)

                                    } else {

                                        //verifica si existen mas de 5 condominos
                                        if (results.rows[0].resp >= 5) {
                                            ///LOGICA PARA EDITAR EL DEPARTAMENTEO
                                            db.query('UPDATE gest_adm_departamento SET dep_ocupacion=false WHERE  dep_id=$1', [departamento_id], (error, results) => {
                                                if (error) {
                                                    response.send(`{"status":"Error", "resp":${error}}`)

                                                } else {

                                                    response.send(`{"status":"OK", "resp":"Condómino registrado exitosamente"}`)
                                                }

                                            })

                                        } else {
                                            response.send(`{"status":"OK", "resp":"Condómino registrado exitosamente"}`)
                                        }
                                    }

                                })

                            }

                        })
                    }
                    // definido que no es un condimino ingresa al proceso de insertar un habitante
                    else {
                        db.query('INSERT INTO seg_sis_residente (res_correo, res_telefono, rol_id, per_id, dep_id) VALUES ($1, $2, $3, $4, $5)', [res_correo, res_telefono, 5, per_id, departamento_id], (error, results) => {
                            if (error) {
                                response.send(`{"status":"Error", "resp":${error}}`)
                            } else {
                                db.query('select count(dep_id) as resp from seg_sis_residente where dep_id=dep_id and dep_id=$1', [departamento_id], (error, results) => {
                                    if (error) {
                                        response.send(`{"status":"Error", "resp":${error}}`)

                                    } else {
                                        if (results.rows[0].resp >= 5) {

                                            db.query('UPDATE gest_adm_departamento SET dep_ocupacion=false WHERE dep_id=$1', [departamento_id], (error, results) => {

                                                if (error) {
                                                    response.send(`{"status":"Error", "resp":${error}}`)

                                                } else {

                                                    response.send(`{"status":"OK", "resp":"Habitante registrado exitosamente"}`)
                                                }
                                            })
                                        } else {
                                            response.send(`{"status":"OK", "resp":"Habitante registrado exitosamente"}`)
                                        }
                                    }

                                })
                            }

                        })
                    }

                }

            })

        }
        // PROCESO NO EXISTE PERSONA si la persona existe entonces
        else {
            //busca la persona
            response.send(`{"status":"Error", "resp":"Residente ya registrado"}`)

            // db.query('select * from seg_sis_residente WHERE per_id = $1', [per_id], (error, results) => {


            //     //CONDICION PARA SABER SI ES CONDOMINO O HABITANTE
            //     if (accion == 'true') {
            //         db.query('INSERT INTO seg_sis_residente (res_correo, res_telefono, res_usuario, res_clave, rol_id, per_id, dep_id) VALUES ($1, $2, $3, $4, $5, $6,$7)', [res_correo, res_telefono, res_usuario, password, 6, per_id, departamento_id], (error, results) => {
            //             if (error) {
            //                 response.status(400).send(`{"status":"Error", "resp":"Algo salio mal H "}`)
            //                 // console
            //                 console.log(error)
            //             } else {
            //                 // AQUI VA LA LOGICA EDITAR DEPARTAMENTO
            //                 db.query('select count(dep_id) as resp from seg_sis_residente where dep_id=dep_id and dep_id=$1', [departamento_id], (error, results) => {
            //                     if (error) {
            //                         response.status(401).send(`{"status":"Error", "resp":"Error al registrar I"}`)

            //                     } else {
            //                         console.log("A")
            //                         console.log(results.rows[0].resp)
            //                         console.log((results.rows[0].resp >= 5))
            //                         // response.status(200).send(`{"status":"OK", "resp":"Resgitrado exitosamente"}`)

            //                         if (results.rows[0].resp >= 5) {
            //                             ///LOGICA PARA EDITAR EL DEPARTAMENTEO
            //                             console.log("si llega 1")
            //                             db.query('UPDATE gest_adm_departamento SET dep_ocupacion=false WHERE dep_id=$1', [departamento_id], (error, results) => {

            //                                 if (error) {
            //                                     response.status(401).send(`{"status":"Error", "resp":"Error al registrar J"}`)

            //                                 } else {
            //                                     console.log("si llega 3")
            //                                     response.status(200).send(`{"status":"OK", "resp":"Resgitrado exitosamente"}`)
            //                                 }
            //                             })
            //                         } else {
            //                             response.status(200).send(`{"status":"OK", "resp":"Resgitrado exitosamente"}`)
            //                         }
            //                     }

            //                 })


            //             }

            //         })
            //     }
            //     //Si no es un condomino ingresa al proceso de ingresar habitante
            //     else {
            //         //inserta el residente como habitante
            //         db.query('INSERT INTO seg_sis_residente (res_correo, res_telefono, rol_id, per_id, dep_id) VALUES ($1, $2, $3, $4, $5)', [res_correo, res_telefono, 5, per_id, departamento_id], (error, results) => {
            //             if (error) {
            //                 response.status(400).send(`{"status":"Error", "resp":"Algo salio mal "}`)
            //                 // console
            //                 console.log(error)
            //             } else {
            //                 /////AQUI VA LA LOGICA APRA EDITAR DEPARTAMENTO
            //                 db.query('select count(dep_id) as resp from seg_sis_residente where dep_id=dep_id and dep_id=$1', [departamento_id], (error, results) => {
            //                     if (error) {
            //                         response.status(401).send(`{"status":"Error", "resp":"Error al registrar J"}`)

            //                     } else {

            //                         console.log("A")
            //                         console.log(results.rows[0].resp)
            //                         console.log((results.rows[0].resp >= 5))
            //                         // response.status(200).send(`{"status":"OK", "resp":"Resgitrado exitosamente"}`)

            //                         if (results.rows[0].resp >= 5) {
            //                             ///LOGICA PARA EDITAR EL DEPARTAMENTEO
            //                             console.log("si llega 1")
            //                             db.query('UPDATE gest_adm_departamento SET dep_ocupacion=false WHERE dep_id=$1', [departamento_id], (error, results) => {

            //                                 if (error) {
            //                                     console.log(error)
            //                                     response.status(401).send(`{"status":"Error", "resp":"Error al registrar    K "}`)

            //                                 } else {
            //                                     console.log("si llega 3")
            //                                     response.status(200).send(`{"status":"OK", "resp":"Resgitrado exitosamente"}`)
            //                                 }
            //                             })
            //                         } else {
            //                             response.status(200).send(`{"status":"OK", "resp":"Resgitrado exitosamente"}`)
            //                         }
            //                     }

            //                 })

            //             }


            //         })
            //     }

            // })



        }

    })



}

// const createResidente = async (request, response) => {

//     const { per_id, per_nombres, per_apellidos, res_correo, res_telefono } = request.body

//     // const password = await encrypt(res_clave);

//     db.query('select per_nombres, per_apellidos from seg_sis_persona WHERE per_id = $1', [per_id], (error, results) => {
//         if (results.rows == "") {
//             db.query('INSERT INTO seg_sis_persona (per_id, per_nombres,per_apellidos ) VALUES ($1, $2, $3)', [per_id, per_nombres, per_apellidos], (error, results) => {
//                 if (error) {
//                     response.status(201).send(`{"status":"Error", "resp":"Algo salio mal A "}`)
//                 } else {
//                     db.query('INSERT INTO seg_sis_residente (res_correo, res_telefono, rol_id,per_id) VALUES ($1, $2, $3, $4)', [res_correo, res_telefono, 5, per_id], (error, results) => {
//                         if (error) {
//                             response.status(201).send(`{"status":"Error", "resp":"Algo salio mal B "}`)
//                             // console
//                             console.log(error)
//                         } else {
//                             response.status(201).send(`{"status":"OK", "resp":"Resgitrado exitosamente A"}`)
//                         }

//                     })
//                 }

//             })

//         } else {
//             db.query('select * from seg_sis_residente WHERE per_id = $1', [per_id], (error, results) => {
//                 if (results.rows == "") {
//                     db.query('INSERT INTO seg_sis_residente (res_correo, res_telefono, rol_id,per_id) VALUES ($1, $2, $3, $4)', [res_correo, res_telefono, 5, per_id], (error, results) => {
//                         if (error) {
//                             response.status(201).send(`{"status":"Error", "resp":"Algo salio mal C"}`)
//                         } else {
//                             response.status(201).send(`{"status":"OK", "resp":"Resgitrado exitoramente B "}`)
//                         }
//                     })
//                 } else {
//                     response.status(201).send(`{"status":"Error", "resp":"Residente ya registrado"}`)
//                 }

//             })


//         }

//     })



// }



const getResidente = (request, response) => {

    const per_id = request.params.per_id;
    db.query('select p.per_id, p.per_nombres,p.per_apellidos, rr.rol_descripcion,rr.rol_id ,r.res_id, r.res_correo, r.res_telefono, r.dep_id from seg_sis_residente r inner join seg_sis_persona  p on p.per_id=r.per_id inner join seg_sis_rol_residente rr on r.rol_id=rr.rol_id WHERE p.per_id = $1', [per_id], (error, results) => {
        if (error) {
            response.send(`{"status":"Error", "resp":${error}}`)
        } else {
            response.status(200).json(results.rows)
        }

    })

}
const getAllResidente = (request, response) => {
    db.query('select p.per_id, p.per_nombres,p.per_apellidos, rr.rol_descripcion, r.res_correo, r.res_telefono from seg_sis_residente r inner join seg_sis_persona  p on p.per_id=r.per_id inner join seg_sis_rol_residente rr on r.rol_id=rr.rol_id where r.rol_id=5', (error, results) => {
        if (error) {
            response.send(`{"status":"Error", "resp":${error}}`)
        } else {
            response.status(200).json(results.rows)
        }


    })

}
const getAllCondomino = (request, response) => {
    db.query('select p.per_id, p.per_nombres,p.per_apellidos, rr.rol_descripcion, r.res_correo, r.res_telefono, r.res_id from seg_sis_residente r inner join seg_sis_persona  p on p.per_id=r.per_id inner join seg_sis_rol_residente rr on r.rol_id=rr.rol_id where r.rol_id=6', (error, results) => {
        if (error) {
            response.send(`{"status":"Error", "resp":${error}}`)
        } else {
            response.status(200).json(results.rows)
        }


    })

}

const getAllCondominoRoles = (request, response) => {
    db.query('select p.per_id, p.per_nombres,p.per_apellidos, rr.rol_descripcion, r.res_correo, r.res_telefono, r.res_id from seg_sis_residente r inner join seg_sis_persona  p on p.per_id=r.per_id inner join seg_sis_rol_residente rr on r.rol_id=rr.rol_id where r.rol_id!=5 and r.rol_id!=6', (error, results) => {
        if (error) {
            response.send(`{"status":"Error", "resp":${error}}`)
        } else {
            response.status(200).json(results.rows)
        }

    })

}
const deleteResidente = (request, response) => {

    const res_id = request.params.res_id;

    db.query('delete from seg_sis_residente where res_id=$1', [res_id], (error, results) => {

        if (error) {
            response.send(`{"status":"Error", "resp":${error}}`)
        } else {
            response.send(`Eliminado correctamente`)
        }


    })
}

const updateCondomino = (request, response) => {
    const { rol_id } = request.body
    const res_id = request.params.res_id;

    db.query('UPDATE seg_sis_residente SET rol_id=$1 WHERE res_id=$2', [rol_id, res_id], (error, results) => {

        if (error) {
            response.send(`{"status":"Error", "resp":${error}}`)
        } else {
            response.send(`{"status":"Ok", "resp":"Asignación correcta"}`)
        }


    })
}

const updateHabitante = (request, response) => {

    const res_id = request.params.res_id;

    db.query('UPDATE seg_sis_residente SET rol_id=5 WHERE res_id=$1', [ res_id], (error, results) => {

        if (error) {
            response.send(`{"status":"Error", "resp":${error}}`)
        } else {
            response.send(`{"status":"Ok", "resp":"Condómino asignado a habitante"}`)
        }


    })
}
const updatetoCondomino = (request, response) => {

    const res_id = request.params.res_id;

    db.query('UPDATE seg_sis_residente SET rol_id=6 WHERE res_id=$1', [ res_id], (error, results) => {

        if (error) {
            response.send(`{"status":"Error", "resp":${error}}`)
        } else {
            response.send(`{"status":"Ok", "resp":"Asignación correcta"}`)
        }


    })
}


const updateResidente = (request, response) => {
    const per_id = request.params.per_id;
    const { per_nombres, per_apellidos, res_correo, res_telefono, departamento_id, res_id } = request.body
    // console.log(per_nombres, per_apellidos, res_correo, res_telefono, departamento_id)
    db.query('update seg_sis_persona set per_nombres=$1, per_apellidos=$2 where per_id=$3', [per_nombres, per_apellidos, per_id], (error, results) => {
        if (error) {
            response.send(`{"status":"Error", "resp":${error}}`)
        } else {
            db.query('update seg_sis_residente set res_correo=$1, res_telefono=$2, dep_id=$4 where per_id=$3', [res_correo, res_telefono, per_id, departamento_id], (error, results) => {
                if (error) {
                    response.send(`{"status":"Error", "resp":${error}}`)
                } else {
                    response.send(`{"status":"Ok", "resp":"Actualizado correctamente"}`)
                }

            })
        }

    })
}


/////DEPARTAMENTOS

const getAllDepartamentos = (request, response) => {

    db.query('select * from gest_adm_departamento where dep_ocupacion=true', (error, results) => {

        if (error) {
            response.status(400).send(`{Error}`)
            // console.log(error)
        } else {
            // console.log(results)
            response.status(200).json(results.rows)

        }


    })
}

//ROLES
const getAllRoles = (request, response) => {

    db.query('select * from seg_sis_rol_residente', (error, results) => {

        if (error) {
            response.send(`{"status":"Error", "resp":${error}}`)
            // console.log(error)
        } else {
            // console.log(results)
            response.status(200).json(results.rows)

        }


    })
}
module.exports = {
    createResidente,
    getResidente,
    getAllResidente,
    deleteResidente,
    updateResidente,
    getAllDepartamentos,
    getAllCondomino,
    updateCondomino,
    getAllRoles,
    updatetoCondomino,
    updateHabitante,
    getAllCondominoRoles

}