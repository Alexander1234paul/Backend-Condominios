const { Router } = require("express");
const router = Router()

const {
    getAllReporte,
    getReporteById,
    createReporte,
    updateReporte,
    deleteReporte
} = require("../controllers/reporte");

router.get('/reportes', getAllReporte)
router.get('/reporte/:rep_id', getReporteById)
router.post('/reporte', createReporte)
router.put("/reporte/:rep_id", updateReporte)
router.delete('/reporte/:rep_id', deleteReporte)

module.exports = router