const { Router } = require("express");
const router = Router()

const {
    getAllMonto,
    getByMonto,
    createMonto,
    updateMonto,
    deleteMonto
} = require("../controllers/monto");

router.get('/montos', getAllMonto)
router.get('/monto/:mon_id', getByMonto)
router.post('/monto', createMonto)
router.put("/monto/:mon_id", updateMonto)
router.delete('/monto/:mon_id', deleteMonto)

module.exports = router