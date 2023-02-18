const { response } = require("express")
const { db } = require("../Conexiones/slq")

const getAllCuota = (request, response) => {

    db.query('select * from gest_adm_alicuota ', (error, results) => {
        if (error)
            throw error
        response.status(200).json(results.rows)
    })
}


const createCuota = async(req, res) => {
    const { ali_descripcion, ali_costo, pagos } = req.body;
    try {
        // Insertar los datos en la tabla gest_adm_alicuota
        const resultAli = await pool.query(
            'INSERT INTO gest_adm_alicuota (ali_descripcion, ali_costo) VALUES ($1, $2) RETURNING ali_id', [ali_descripcion, ali_costo]
        );
        const aliId = resultAli.rows[0].ali_id;
        // Insertar los datos en la tabla gest_adm_pago
        const values = pagos.map((pago) => [pago.pag_descripcion, pago.pag_costo, aliId]);
        const resultPagos = await pool.query(
            'INSERT INTO gest_adm_pago (pag_descripcion, pag_costo, ali_id) VALUES $1', [values]
        );

        res.status(200).send('Datos insertados correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al insertar los datos');
    }
};






const updateCuota = (request, response) => {
    const cuo_id = request.params.cuo_id;
    const { cuo_descripcion, cuo_costo } = request.body
    console.log('id' + cuo_id)

    db.query('update gest_adm_pago set cuo_descripcion=$1, cuo_costo=$2 where cuo_id=$3', [cuo_descripcion, cuo_costo, cuo_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Cuota modified with ${cuo_id}`)
    })
}

const deleteCuota = (request, response) => {

    const cuo_id = request.params.cuo_id;

    console.log('id' + cuo_id)

    db.query('delete from gest_adm_pago where cuo_id=$1', [cuo_id], (error, results) => {
        if (error)
            throw error
        response.status(200).send(`Delete id ${cuo_id}`)
    })
}

module.exports = {
    getAllCuota,
    createCuota,
    updateCuota,
    deleteCuota

}