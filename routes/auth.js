const { Router } = require("express");
const router = Router()

const { loginCtrl, sendEmail,sendEmailtoAll } = require("../controllers/auth")

router.post('/auth', loginCtrl)
router.post('/sendmail', sendEmail)

router.post('/sendmailtoAll', sendEmailtoAll)

module.exports = router