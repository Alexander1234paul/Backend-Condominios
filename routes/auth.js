const { Router } = require("express");
const router = Router()

const {
    loginCtrl
} = require("../controllers/auth")

router.post('/auth', loginCtrl)



module.exports = router