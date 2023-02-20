const { response } = require("express")
const { db } = require("../Conexiones/slq")
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');

require('dotenv').config();

const getAllCuota = (request, response) => {

    db.query('select pag_id, pag_descripcion, pag_costo, ali_descripcion from gest_adm_pago p INNER JOIN gest_adm_alicuota a on a.ali_id = p.ali_id', (error, results) => {
        if (error)
            throw error
        response.status(200).json(results.rows)
    })
}

const getAllDetallePago = (request, response) => {

    db.query('SELECT cdp.*, per.per_nombres, per.per_apellidos, res.res_correo, al.ali_descripcion, al.ali_costo FROM cont_detalle_pago cdp INNER JOIN seg_sis_residente res ON cdp.res_id = res.res_id INNER JOIN seg_sis_persona per ON res.per_id = per.per_id INNER JOIN gest_adm_alicuota al ON cdp.ali_id = al.ali_id WHERE cdp.dpag_estado = false', (error, results) => {
        if (error)
            throw error
        response.status(200).json(results.rows)
    })
}

const createDetallePago = (req, res) => {
    const dpag_fecha = req.body.dpag_fecha;
    const res_id = req.body.res_id;
    const ali_id = req.body.ali_id;

    // Consulta para obtener el ali_costo de la tabla relacionada
    const query = {
        text: 'SELECT ali_costo FROM gest_adm_alicuota WHERE ali_id = $1',
        values: [ali_id],
    };

    db.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al obtener el ali_costo');
        } else {
            const ali_costo = result.rows[0].ali_costo;

            // Consulta para insertar los datos en la tabla cont_detalle_pago
            const insertQuery = {
                text: 'INSERT INTO cont_detalle_pago (dpag_fecha, res_id, ali_id, dpag_estado, total) VALUES ($1, $2, $3, $4, $5)',
                values: [dpag_fecha, res_id, ali_id, false, ali_costo],
            };

            db.query(insertQuery, (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error al insertar datos en la tabla cont_detalle_pago');
                } else {
                    res.status(200).send('Datos insertados correctamente');
                }
            });
        }
    });
};


const getAllAlicuota = (request, response) => {

    db.query('select * from gest_adm_alicuota order by ali_id', (error, results) => {
        if (error)
            throw error
        response.status(200).json(results.rows)
    })
}

const getByCuota = (request, response) => {

    const cuo_id = request.params.cuo_id;

    console.log('id' + cuo_id)
    db.query('SELECT * FROM gest_adm_pago WHERE cuo_id = $1', [cuo_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createCuota = async(req, res) => {
    const { ali_descripcion, ali_costo, pagos } = req.body;
    try {
        // Insertar los datos en la tabla gest_adm_alicuota
        const resultAli = await db.query(
            'INSERT INTO gest_adm_alicuota (ali_descripcion, ali_costo) VALUES ($1, $2) RETURNING ali_id', [ali_descripcion, ali_costo]
        );
        const ali_id = resultAli.rows[0].ali_id;
        // Insertar en gest_adm_pago
        for (let pago of pagos) {
            await db.query('INSERT INTO gest_adm_pago (pag_descripcion, pag_costo, ali_id) VALUES ($1, $2, $3)', [pago.pag_descripcion, pago.pag_costo, ali_id]);
        }

        res.status(200).send('Datos insertados correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al insertar los datos');
    }
};

const updatePago = async(req, res) => {
    const pag_id = req.params.pag_id;
    const { pag_descripcion, pag_costo } = req.body;

    try {
        await db.query('BEGIN'); // Iniciar una transacción

        // Actualizar la tabla gest_adm_pago
        const updateGestAdmPago = await db.query(
            'UPDATE gest_adm_pago SET pag_descripcion = $1, pag_costo = $2 WHERE pag_id = $3 RETURNING ali_id', [pag_descripcion, pag_costo, pag_id]
        );
        const aliId = updateGestAdmPago.rows[0].ali_id;

        // Realizar la sumatoria de los valores pag_costo que tengan el mismo ali_id y actualizar la tabla gest_adm_alicuota
        const sumPagCosto = await db.query(
            'SELECT SUM(pag_costo) FROM gest_adm_pago WHERE ali_id = $1', [aliId]
        );
        const aliCosto = sumPagCosto.rows[0].sum;
        await db.query(
            'UPDATE gest_adm_alicuota SET ali_costo = $1 WHERE ali_id = $2', [aliCosto, aliId]
        );

        // Actualizar la tabla cont_detalle_pago
        await db.query(
            'UPDATE cont_detalle_pago SET total = $1 WHERE ali_id = $2', [aliCosto, aliId]
        );

        await db.query('COMMIT'); // Confirmar la transacción

        res.status(200).json({ message: 'Tres tablas actualizadas con éxito' });
    } catch (error) {
        await db.query('ROLLBACK'); // Deshacer la transacción en caso de error
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar las tres tablas' });
    }

};


const updateAlicuota = async(req, res) => {
    const { ali_id } = req.params;
    const { ali_descripcion } = req.body;

    try {
        const updateQuery = `
        UPDATE gest_adm_alicuota
        SET ali_descripcion = $1
        WHERE ali_id = $2
      `;
        const values = [ali_descripcion, ali_id];
        const result = await db.query(updateQuery, values);

        res.status(200).json({
            message: 'Alicuota actualizada correctamente',
            rowsAffected: result.rowCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Ocurrió un error al actualizar la alicuota',
            error: error.message,
        });
    }
};

const getPagoByaliID = async(req, res) => {
    const ali_id = req.params.ali_id;
    try {
        const query = `SELECT * FROM gest_adm_alicuota JOIN gest_adm_pago ON gest_adm_alicuota.ali_id = gest_adm_pago.ali_id WHERE gest_adm_alicuota.ali_id = $1`;
        const { rows } = await db.query(query, [ali_id]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los datos' });
    }
};


const deleteAliCuota = (req, res) => {
    const ali_id = req.params.ali_id;

    // Eliminar filas relacionadas en la tabla gest_adm_pago
    // utilizando el ID de la fila en la tabla principal
    const deletePagosQuery = 'DELETE FROM gest_adm_pago WHERE ali_id = $1';
    db.query(deletePagosQuery, [ali_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al eliminar los pagos relacionados');
        } else {
            // Eliminar filas relacionadas en la tabla cont_detalle_pago
            // utilizando el ID de la fila en la tabla principal
            const deleteDetallesQuery = 'DELETE FROM cont_detalle_pago WHERE ali_id = $1';
            db.query(deleteDetallesQuery, [ali_id], (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error al eliminar los detalles de pago relacionados');
                } else {
                    const deleteAlicuotaQuery = 'DELETE FROM gest_adm_alicuota WHERE ali_id = $1';
                    db.query(deleteAlicuotaQuery, [ali_id], (err, result) => {
                        if (err) {
                            console.error(err);
                            res.status(500).send('Error al eliminar la alicuota');
                        } else {
                            res.status(200).send(`Se ha eliminado la alicuota con ID ${ali_id}`);
                        }
                    });
                }
            });
        }
    });
};

const deletePago = async(req, res) => {
    const pag_id = req.params.pag_id;
    const ali_id = req.params.ali_id;

    try {
        await db.query('BEGIN'); // Iniciar una transacción

        // Actualizar la tabla gest_adm_pago
        const updateGestAdmPago = await db.query(
            'DELETE FROM gest_adm_pago WHERE pag_id = $1', [pag_id]
        );
        const aliId = ali_id;

        const sumPagCosto = await db.query(
            'SELECT SUM(pag_costo) FROM gest_adm_pago WHERE ali_id = $1', [aliId]
        );
        const aliCosto = sumPagCosto.rows[0].sum;
        await db.query(
            'UPDATE gest_adm_alicuota SET ali_costo = $1 WHERE ali_id = $2', [aliCosto, aliId]
        );

        await db.query(
            'UPDATE cont_detalle_pago SET total = $1 WHERE ali_id = $2', [aliCosto, aliId]
        );

        await db.query('COMMIT'); // Confirmar la transacción

        res.status(200).json({ message: 'Tres tablas actualizadas con éxito' });
    } catch (error) {
        await db.query('ROLLBACK'); // Deshacer la transacción en caso de error
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar las tres tablas' });
    }

};

const createPagoByID = async(req, res) => {
    const { ali_id } = req.params;
    const { pagos } = req.body;

    try {
        for (let i = 0; i < pagos.length; i++) {
            const { pag_descripcion, pag_costo } = pagos[i];
            const query = 'INSERT INTO gest_adm_pago (pag_descripcion, pag_costo, ali_id) VALUES ($1, $2, $3)';
            await db.query(query, [pag_descripcion, pag_costo, ali_id]);
        }

        const sumPagCosto = await db.query(
            'SELECT SUM(pag_costo) FROM gest_adm_pago WHERE ali_id = $1', [ali_id]
        );
        const aliCosto = sumPagCosto.rows[0].sum;
        await db.query(
            'UPDATE gest_adm_alicuota SET ali_costo = $1 WHERE ali_id = $2', [aliCosto, ali_id]
        );

        // Actualizar la tabla cont_detalle_pago
        await db.query(
            'UPDATE cont_detalle_pago SET total = $1 WHERE ali_id = $2', [aliCosto, ali_id]
        );

        await db.query('COMMIT'); // Confirmar la transacción

        res.status(200).json({ message: 'Pagos Insertados' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al insertar los pagos');
    }
};

const updateEstado = async(req, res) => {
    const dpag_id = req.params.dpag_id;
    const res_correo = req.params.res_correo;

    try {
        const updateQuery = 'UPDATE cont_detalle_pago SET dpag_estado = $1 WHERE dpag_id = $2';
        const updateValues = [true, dpag_id];
        await db.query(updateQuery, updateValues);

        const doc = new PDFDocument();
        doc.text('Comprobante de pago');
        const pdfBuffer = await new Promise((resolve) => {
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                resolve(Buffer.concat(buffers));
            });
            doc.end();
        });

        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });
        const mailOptions = {
            from: process.env.USER,
            to: res_correo,
            subject: 'Comprobante de pago',
            text: '¡Hola! Te confirmamos que el pago se ha realizado con éxito.',
            attachments: [{
                filename: 'comprobante_de_pago.pdf',
                content: pdfBuffer,
                contentType: 'application/pdf',
            }, ],
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Correo Enviado' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al enviar el correo');
    }
};

module.exports = {
    getAllCuota,
    getAllAlicuota,
    getByCuota,
    createCuota,
    deleteAliCuota,
    getAllDetallePago,
    createDetallePago,
    getPagoByaliID,
    updatePago,
    updateAlicuota,
    deletePago,
    createPagoByID,
    updateEstado
}