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
    getAllDepartamentos
} = require("../controllers/residente");

router.post('/Residente', createResidente)
router.get('/Residente/:per_id', getResidente)
// router.get('/Residente', checkAuth, checkRoleAuth(['Presidente']), getAllResidente)
router.get('/Residente', getAllResidente)
router.delete('/Residente/:res_id', deleteResidente)
router.put('/Residente/:per_id', updateResidente)
router.get('/Departamento', getAllDepartamentos)




module.exports = router
