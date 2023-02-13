const { Router } = require("express");
const router = Router()

const {
    createRolResidente,
    getRolResidenteById,
    getAllRolResidentes,
    deleteRolResidente,
    updateRolResidente,
    getAllRolResidentesA
} = require("../controllers/RolResidente");


router.post('/rol_residente', createRolResidente)
router.get('/rol_residente/:rol_id', getRolResidenteById)
router.get('/rol_residentes', getAllRolResidentes)
router.get('/rol_residentesA', getAllRolResidentesA)
router.delete('/rol_residente/:rol_id', deleteRolResidente)
router.put('/rol_residente/:rol_id', updateRolResidente)



module.exports = router