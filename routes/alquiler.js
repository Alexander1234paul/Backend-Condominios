const {Router} = require('express')
const router = Router()
const { createAlquiler, getAllAlquiler,getAlquilerById, updateAlquiler, deleteAlquiler } = require('../controllers/alquiler')


router.post('/alquileres/',createAlquiler)
router.get('/alquileres',getAllAlquiler)
router.get('/alquileres/:alq_id',getAlquilerById)
router.put("/alquileres/:alq_id",updateAlquiler)
router.delete('/alquileres/:alq_id',deleteAlquiler)

module.exports=router