const { Router } = require("express");
const router = Router()

const {
    getAllDCuota,
    getByDCuota,
    createDCuota,
    updateDCuota,
    deleteDCuota
} = require("../controllers/detalle_cuota");

router.get('/dcuota', getAllDCuota)
router.get('/dcuota/:dcuo_id', getByDCuota)
router.post('/dcuota', createDCuota)
router.put("/dcuota/:dcuo_id", updateDCuota)
router.delete('/dcuota/:dcuo_id', deleteDCuota)

module.exports = router