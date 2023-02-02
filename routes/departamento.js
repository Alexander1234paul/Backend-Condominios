const {Router} = require('express')
const router = Router()
const { createDepartamento, getAllDepartamento, getDepartamentoById, updateDepartamento, deleteDepartamento } = require('../controllers/departamento')


router.post('/departamentos/',createDepartamento)
router.get('/departamentos',getAllDepartamento)
router.get('/departamentos/:dep_id',getDepartamentoById)
router.put("/departamentos/:dep_id",updateDepartamento)
router.delete('/departamentos/:dep_id',deleteDepartamento)

module.exports=router