const { Router } = require("express");
const router = Router()

const {
    getAllVehiculo,
    getVehiculoById,
    createVehiculo,
    updateVehiculo,
    deleteVehiculo
} = require("../controllers/vehiculo");

router.get('/vehiculos', getAllVehiculo)
router.get('/vehiculo/:veh_placa', getVehiculoById)
router.post('/vehiculo', createVehiculo)
router.put("/vehiculo/:veh_placa", updateVehiculo)
router.delete('/vehiculo/:veh_placa', deleteVehiculo)

module.exports = router