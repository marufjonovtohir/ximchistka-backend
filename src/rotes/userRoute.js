const router =require("express").Router()

const userCtrl = require("../controller/userCtrl")

router.post("/signup",userCtrl.createuser)
router.post("/login", userCtrl.login)
router.get("/getallusers",userCtrl.getAllUsers)
router.delete("/delete/:id", userCtrl.delUser)


module.exports = router