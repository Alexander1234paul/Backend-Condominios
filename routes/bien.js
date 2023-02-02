const {Router} = require('express')
const router = Router()
const {createBien, getAllBien, getBienById, updateBien, deleteBien } = require('../controllers/bien')


router.post('/bienes/',createBien)
router.get('/bienes',getAllBien)
router.get('/bienes/:bien_id',getBienById)
router.put("/bienes/:bien_id",updateBien)
router.delete('/bienes/:bien_id',deleteBien)

module.exports=router