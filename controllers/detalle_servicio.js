const { response } = require("express")
const { db } = require("../Conexiones/slq")
const Img = require("../models/img");
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const createDetalleServicio = (request, response) => {
    const { dser_evidencia, ser_id } = request.body

    db.query('INSERT INTO res_detalle_servicio (dser_evidencia, ser_id ) VALUES ($1, $2)', [dser_evidencia, ser_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Tipo Servicio added with: ${dser_evidencia, ser_id}`)
    })
}

const getDetalleServicioById = (request, response) => {

    const dser_id = request.params.dser_id;

    console.log('id is ' + dser_id)
    db.query('SELECT * FROM res_detalle_servicio WHERE dser_id = $1', [dser_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}


const getAllDetalleServicios = (request, response) => {

    db.query('SELECT dser_id, dser_evidencia, ser_descripcion, id_mongo FROM res_detalle_servicio ds INNER JOIN res_servicio s on s.ser_id = ds.ser_id', (error, results) => {
        if (error)
            throw error
        response.status(200).json(results.rows)
    })
}


// const deleteDetalleServicio = async(request, response) => {
//     const dser_id = request.params.dser_id;
//     console.log('id is ' + dser_id)
//         // Eliminar registro de res_detalle_servicio
//     db.query('DELETE FROM res_detalle_servicio WHERE dser_id = $1', [dser_id], (error, result) => {
//         if (error) {
//             response.send(`{"status":"Error", "resp":${error}}`);
//         } else {
//             response.send(`{"status":"Ok", "resp":"Eliminacion correcta"}`);
//         }
//     });

//     // Obtener id_mongo desde la base de datos
//     db.query('SELECT id_mongo FROM res_detalle_servicio WHERE dser_id = $1', [dser_id], async(error, results) => {
//         if (error) {
//             response.send(`{"status":"Error", "resp":${error}}`);
//         } else {
//             const id_mongo = results.rows[0].id_mongo;
//             const id = new ObjectId(id_mongo.slice(1, -1));

//             // Crear ObjectId
//             const objectId = new mongoose.Types.ObjectId(id);

//             // Eliminar imagen y registro de MongoDB
//             try {
//                 let img = await Img.findOne({ _id: objectId });
//                 const publicId = img.publicId;
//                 await removeFromCloudinary(publicId);
//                 await img.remove();
//                 response.send(`{"status":"Ok", "resp":"Eliminacion correcta"}`);
//             } catch (err) {
//                 console.log(err);
//                 response.send(`{"status":"Error", "resp":${err}}`);
//             }
//         }
//     });
// }
const deleteDetalleServicio = async(request, response) => {
    const dser_id = request.params.dser_id;
    console.log('id is ' + dser_id);

    try {
        // Obtener id_mongo desde la base de datos
        const getIdMongoPromise = new Promise((resolve, reject) => {
            db.query(
                'SELECT id_mongo FROM res_detalle_servicio WHERE dser_id = $1', [dser_id],
                async(error, results) => {
                    if (error) {
                        reject(error);
                    } else if (results.rows.length > 0) {
                        const id_mongo = results.rows[0].id_mongo;
                        const id = new ObjectId(id_mongo.slice(1, -1));
                        resolve(id);
                    } else {
                        reject(
                            new Error(`No se encontró ningún registro con dser_id ${dser_id}`)
                        );
                    }
                }
            );
        });

        // Eliminar imagen y registro de MongoDB
        const objectId = await getIdMongoPromise;
        let img = await Img.findOne({ _id: objectId });
        const publicId = img.publicId;
        await removeFromCloudinary(publicId);
        await img.remove();

        // Eliminar registro de res_detalle_servicio
        const deleteResDetalleServicioPromise = new Promise((resolve, reject) => {
            db.query(
                'DELETE FROM res_detalle_servicio WHERE dser_id = $1', [dser_id],
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
        });

        // Esperar a que ambas consultas se completen
        const [deleteResDetalleServicioResult] = await Promise.all([
            deleteResDetalleServicioPromise,
        ]);

        // Verificar que se eliminó el registro de MongoDB antes de enviar la respuesta
        if (img && img.deletedCount === 1) {
            response.send('{"status":"Ok", "resp":"Eliminacion correcta"}');
        } else {
            response.send(
                '{"status":"Error", "resp":"Error al eliminar el registro de MongoDB"}'
            );
        }
    } catch (error) {
        console.log(error);
        response.send(`{"status":"Error", "resp":${error}}`);
    }
};

const updateDetalleServicio = async(request, response) => {
    const { id } = request.params;
    const { ser_id } = request.body;


    try {
        // Start a transaction
        const session = await mongoose.startSession();
        session.startTransaction();
        const id = new ObjectId(id_mongo.slice(1, -1));

        // Subir imagen a Cloudinary y obtener el nuevo public_id y URL
        const data = await uploadToCloudinary(request.file.path, "condominio");
        const { public_id, url } = data;

        // Actualizar registro en MongoDB
        const updatedImg = await Img.findByIdAndUpdate({
            _id: req.params.id,
            name: data.name,
            imageUrl: url,
            publicId: public_id,
        }, { session });

        // Tomar el nuevo public_id y URL
        const id_mongo = updatedImg._id;
        const newUrl = updatedImg.imageUrl;

        // Actualizar registro en PostgreSQL
        const updateResult = await db.query(
            'UPDATE res_detalle_servicio SET dser_evidencia=$1, id_mongo=$3 WHERE dser_id=$4', [newUrl, ser_id, id_mongo, id], { session }
        );

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        // Verificar que se actualizó el registro
        if (updateResult.rowCount === 1) {
            response.send('{"status":"Ok", "resp":"Actualización correcta"}');
        } else {
            throw new Error(`No se pudo actualizar el registro de detalle de servicio con ID ${id}.`);
        }

    } catch (error) {
        console.error(error);

        // Abort the transaction
        await session.abortTransaction();
        session.endSession();

        response.status(400).send(`Ocurrió un error al actualizar el detalle de servicio con ID ${id}.`);
    }
};





// const updateDetalleServicio = async(request, response) => {
//     const dser_id = request.params.dser_id;
//     const { dser_evidencia, ser_id } = request.body
//     console.log('id is ' + dser_id)

//     db.query('update res_detalle_servicio set dser_evidencia=$1, ser_id=$2 where dser_id=$3', [dser_evidencia, ser_id, dser_id], (error, results) => {
//         if (error) {
//             throw error
//         }
//         response.status(200).send(`Tipo Servicio modified with ${dser_id}`)
//     })
//     try {
//         //Upload Image to Cloudinary
//         let img = await Img.findOne({ _id: req.params.id });
//         const publicId = img.publicId;
//         // Delete image from cloudinary
//         await removeFromCloudinary(publicId);
//         const data = await uploadToCloudinary(req.file.path, "condominio");
//         //Save Image Url and publiId ti the database
//         const savedImg = await Img.updateOne({ _id: req.params.id }, {
//             $set: {
//                 name: data.name,
//                 imageUrl: data.url,
//                 publicId: data.public_id,
//             },
//         });

//         res.status(200).send("user image uploaded with success!");
//     } catch (error) {
//         res.status(400).send(error);
//     }
// }


module.exports = {
    createDetalleServicio,
    getDetalleServicioById,
    getAllDetalleServicios,
    deleteDetalleServicio,
    updateDetalleServicio

}