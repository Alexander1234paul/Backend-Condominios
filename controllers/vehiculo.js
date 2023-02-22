const { response } = require("express")
const { db } = require("../Conexiones/slq")

const createVehiculo = (request, response) => {
    const { veh_placa, veh_marca, veh_modelo, veh_color, res_id } = request.body;

    db.query('SELECT veh_placa FROM seg_cond_vehiculo WHERE veh_placa = $1', [veh_placa], (error, results) => {
        if (error) {
            console.error(error);
            response.send(`{"status":"Error", "resp":${error}}`)
        } else if (results.rows.length > 0) {
            response.send(`{"status":"Error", "resp":Placa Ya exitente}`)
        } else {
            db.query('INSERT INTO seg_cond_vehiculo (veh_placa, veh_marca, veh_modelo, veh_color, res_id) VALUES ($1, $2, $3, $4, $5)', [veh_placa, veh_marca, veh_modelo, veh_color, res_id], (error, results) => {
                if (error) {
                    console.error(error);
                    response.send(`{"status":"Error", "resp":${error}}`)
                } else {
                    response.send('{"status":"Ok", "resp":"Vehiculo Insertado correcta"}');
                }
            });
        }
    });
};


const getAllVehiculo = (request, response) => {

    db.query('SELECT v.*, CONCAT (ssp.per_nombres,ssp.per_apellidos) as resi from seg_cond_vehiculo v inner join seg_sis_residente ssr on v.res_id=ssr.res_id inner join seg_sis_persona ssp on ssr.per_id=ssp.per_id', (error, results) => {
        if (error)
            throw error
        response.status(200).json(results.rows)
    })
}

const getVehiculoById = (request, response) => {
    const veh_placa = request.params.veh_placa;
    console.log('id is ' + veh_placa)
    db.query('SELECT * FROM seg_cond_vehiculo WHERE veh_placa = $1', [veh_placa], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const updateVehiculo = (request, response) => {
    const veh_placa = request.params.veh_placa;
    const { veh_marca, veh_modelo, veh_color, res_id } = request.body
    console.log('id is ' + veh_placa)

    db.query(`UPDATE seg_cond_vehiculo SET veh_marca=$1, veh_modelo=$2, veh_color=$3, res_id=$4 WHERE veh_placa=$5`, [veh_marca, veh_modelo, veh_color, res_id, veh_placa], (error, results) => {
        if (error) {
            throw error
            console.log(error)
        }
        response.send('{"status":"Ok", "resp":"Actualización correcta"}');
    })
}

const deleteVehiculo = (request, response) => {

    const veh_placa = request.params.veh_placa;
    console.log('id is ' + veh_placa)
    db.query('DELETE from seg_cond_vehiculo WHERE veh_placa=$1', [veh_placa], (error, results) => {
        if (error)
            throw error
        response.status(200).send(`Deleted id is ${veh_placa}`)
    })
}


module.exports = {
    createVehiculo,
    getAllVehiculo,
    getVehiculoById,
    updateVehiculo,
    deleteVehiculo

}