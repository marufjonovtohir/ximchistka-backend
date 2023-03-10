const router = require("express").Router()

const categoryCtrl = require("../controller/categoryCtrl")

router.post("/category",categoryCtrl.createCategory)
router.get("/category", categoryCtrl.getListCategory)
router.put("/category/:id",categoryCtrl.updateCategory)
router.delete("/category/:id", categoryCtrl.deleteCategory)



module.exports = router