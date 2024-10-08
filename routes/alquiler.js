const { Router } = require('express')
const router = Router()
const { createAlquiler, getAllAlquiler, getAlquilerById, updateAlquiler, deleteAlquiler,
    getPagoAlicuota, getPagoReservaciones, getDetalleAlicuotaByID, getResServicio, getSumaResServicio, createAlquilerUsuarios,
    createVerificarAlquilerUsuarios, getAllAlquileru,getTotalMulta,getDetByIdMulta,getRolUser, createVerificarAlquiler
} = require('../controllers/alquiler')


router.post('/alquileres/', createAlquiler)
router.get('/alquileres', getAllAlquiler)
router.get('/alquileres/:alq_id', getAlquilerById)
router.put("/alquileres/:alq_id", updateAlquiler)
router.delete('/alquileres/:alq_id', deleteAlquiler)


/// PAGOS USUARIOS
router.get('/alicuota/:token', getPagoAlicuota)
router.get('/reservaciones/:token', getPagoReservaciones)
router.get('/detealleali/:ali_id', getDetalleAlicuotaByID)

// RES USUARIOS
router.get('/reservicios', getResServicio)
router.get('/reserviciosS', getSumaResServicio)

// ALQUILEER USUAQIOS

router.post('/alquileru', createAlquilerUsuarios)
router.post('/alquilerv', createVerificarAlquilerUsuarios)
router.get('/alquileresu/:token', getAllAlquileru)

/// MULTAS

// Nuevas
router.get('/totalmulta/:token', getTotalMulta)
router.get('/detmulta/:token', getDetByIdMulta)
router.get('/getUser/:token', getRolUser)
router.post('/alqv', createVerificarAlquiler)


module.exports = router