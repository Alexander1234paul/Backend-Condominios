const { Router } = require("express");
const router = Router()
const checkAuth = require("../middleware/auth")
const checkRoleAuth = require("../middleware/rol")
const {
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
} = require("../controllers/residente");

router.post('/Residente', createResidente)
router.get('/Residente/:per_id', getResidente)
router.get('/Residente', getAllResidente)
router.delete('/Residente/:res_id', deleteResidente)
router.put('/Residente/:per_id', updateResidente)
// router.get('/Residente', checkAuth, checkRoleAuth(['Presidente']), getAllResidente)



//CONDOMINO
router.put('/Condomino/:res_id', updateCondomino)
router.put('/toCondomino/:res_id', updatetoCondomino)
router.put('/Habitante/:res_id', updateHabitante)
router.get('/Condomino', getAllCondomino)
router.get('/CondominoA', getAllCondominoRoles)
//DEPARTMENTOS
router.get('/Departamento', getAllDepartamentos)

//ROLES
// router.get('/Departamento', getAllDepartamentos)




module.exports = router
