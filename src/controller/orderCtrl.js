const Order = require("../models/orderModel")
const Product = require("../models/productModel")
const User = require ("../models/userModel")
const JWT = require("jsonwebtoken")

const orderCtrl ={
    AddOrderProduct: async (req,res)=>{
        try {
            const {productId, userId, price, count, city, district} = req.body

            const product = await Product.findById(productId)

            if(product){
                const price = product.price * count

                const newOrder = new Order({productId: productId, userId: userId, count,price, district, city, })
                
                newOrder.save()
            
                return res.status(201).json({message: "Buyurtamngiz qabul qilindi operatorlarimiz siz bogladi ", newOrder})
            }
            res.status(404).json({message: "Ushbu mahsulot qabul qilinyapti!"})
        } catch (error) {
            res.status(500).json()
        }
    },
    getSales: async (req, res) => {
        try {
            const {token} = req.headers
            if(token){
                const user = await JWT.verify(token, process.env.JWT_SECRET_KEY)
                if(user.role === "admin" || user.role === "operator") {
                    const orders = await Order.find({isActive: true}).populate({
                        path: "productId",
                        select: [ "name",]
                    }).populate({
                        path: "userId",
                        select: ["phoneNumber", "email", "name",]
                    })
                    return res.status(200).json(orders)
                }else{
                    return res.status(400).json({msg: "Only Admin can access !"})
                }
            }else{
                res.status(404).json({msg: "JWT User Not Fount"})
            }
        } catch (error) {
            res.status(500).json({msg: error})
        }
    },
    deleteSales: async (req, res) => {
        const {id} = req.params
        const delSalesHis = await Order.findByIdAndDelete(id)

        if(delSalesHis){
            return res.status(200).json({msg: "Product deleted", delSalesHis})
        }

        res.status(403).json({message: "Product not found!"}) 
    },
    getByIdOrder: async (req, res) => {
        const {productId} = req.params
        const {token} = req.headers
        try {
            if(token){
                const user = await JWT.verify(token, process.env.JWT_SECRET_KEY)
                if(user.role === "admin" || user.role === "operator"){
                    const order = await Order.find({productId}).populate({
                        path: "productId",
                        select: [ "name", "desc"]
                    }).populate({
                        path: "userId",
                        select: ["email", "name", "phoneNumber"]
                    })
                    return res.status(200).json({msg: "This product has been shipped", order})
                }
                return res.status(400).json({msg: " JWT not found"})
            }else{
                res.status(400).json({msg: "You have no such right"})
            }            
        } catch (error) {
            res.status(500).json({msg: error})
        }
    },
    getByIdAndOne: async (req, res) => {
        const {orderId} = req.params
        const {token} = req.headers
        try {
            if(token){
                const user = await JWT.verify(token, process.env.JWT_SECRET_KEY)
                if(user.role === "admin" || user.role === "operator"){
                    const order = await Order.findById(orderId).populate({
                        path: "productId",
                        select: ["name", "desc"]
                    }).populate({
                        path: "userId",
                        select: ["name",  "phoneNumber"]
                    })
                    return res.status(200).json({msg: "This product has been shipped", order})
                }
                return res.status(400).json({msg: "JWT not found"})
            }else{
                res.status(400).json({msg: "You have no such right"})
            }
        } catch (error) {
            res.status(500).json({msg: error})
        }
    }
}

module.exports = orderCtrl