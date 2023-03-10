const router = require("express").Router()

const productCtrl = require ("../controller/productCtrl")

router.post("/newproduct", productCtrl.addProduct)
router.get("/product", productCtrl.getAllProducts)
router.get("/product/one/:id", productCtrl.getProductById)
router.get("/product/:id", productCtrl.getProductsByCategory)
router.delete("/product/:id", productCtrl.deleteProduct)


module.exports = router