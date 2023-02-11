const { Router } = require("express");
const router = Router()

const { loginCtrl, sendEmail } = require("../controllers/auth")

router.post('/auth', loginCtrl)
router.post('/sendmail', sendEmail)



module.exports = router