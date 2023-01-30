const { response } = require("express")
const { db } = require("../Conexiones/slq")

const createVehiculo= (request, response) => {
    const {veh_placa,veh_marca,veh_modelo,veh_color,res_id} = request.body

    db.query(`INSERT INTO vehiculo (veh_placa,veh_marca,veh_modelo,veh_color,res_id) 
    VALUES ($1,$2,$3,$4,$5)`, [veh_placa,veh_marca,veh_modelo,veh_color,res_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Vehiculo added with: ${veh_placa,veh_marca,veh_modelo,veh_color,res_id}`)
    })
}

const getAllVehiculo = (request, response) => {

    db.query('SELECT * FROM vehiculo ', (error, results) => {
        if (error)
            throw error
        response.status(200).json(results.rows)
    })
}

const getVehiculoById = (request, response) => {
    const veh_placa = request.params.veh_placa;
    console.log('id is ' + veh_placa)
    db.query('SELECT * FROM vehiculo WHERE veh_placa = $1', [veh_placa], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const updateVehiculo = (request, response) => {
    const veh_placa = request.params.veh_placa;
    const {veh_marca,veh_modelo,veh_color,res_id} = request.body
    console.log('id is ' + veh_placa)

    db.query(`UPDATE Vehiculo SET veh_marca=$1, veh_modelo=$2, veh_color=$3, res_id=$4 WHERE veh_placa=$5`, [veh_marca,veh_modelo,veh_color,res_id,veh_placa], (error, results) => {
        if (error) {
            throw error
            console.log(error)
        }
        
        response.status(200).send(`Vehiculo modified with ${veh_placa}`)
    })
}

const deleteVehiculo = (request, response) => {

    const veh_placa = request.params.veh_placa;
    console.log('id is ' + veh_placa)
    db.query('DELETE from vehiculo WHERE veh_placa=$1', [veh_placa], (error, results) => {
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