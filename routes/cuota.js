const { Router } = require("express");
const router = Router()

const {
    getAllCuota,
    getByCuota,
    createCuota,
    updateCuota,
    deleteCuota
} = require("../controllers/cuota");

router.get('/cuota', getAllCuota)
router.get('/cuota/:cuo_id', getByCuota)
router.post('/cuota', createCuota)
router.put("/cuota/:cuo_id", updateCuota)
router.delete('/cuota/:cuo_id', deleteCuota)

module.exports = router