const { Router } = require("express");
const router = Router()
const checkAuth = require("../middleware/auth")
const checkRoleAuth = require("../middleware/rol")
const {
    createResidente,
    getResidente,
    getAllResidente,
    deleteResidente,
    updateResidente
} = require("../controllers/residente");

router.post('/Residente', createResidente)
router.get('/Residente/:per_id', getResidente)
// router.get('/Residente', getAllResidente)
router.get('/Residente', checkAuth, checkRoleAuth(['President','Presidente']), getAllResidente)
router.delete('/Residente/:res_id', deleteResidente)
router.put('/Residente/:per_id', updateResidente)


module.exports = router