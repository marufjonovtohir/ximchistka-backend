const SalesHstory = require("../models/salesHistoryModel")
const Order = require ("../models/orderModel")
const JWT = require("jsonwebtoken")

const salesHistoryCtrl = {
    addSalesHis: async (req, res) => {

        const {operatorId, orderId} = req.body
        try {
            const order = await Order.findById(orderId)
            if(order.isActive){
                await Order.findByIdAndUpdate(orderId, {isActive: false})

                const newSalesHis = await SalesHstory({orderId: orderId, operatorId: operatorId})
                await newSalesHis.save()
                return res.status(201).send({msg: "Mahsulot sizga yetkazildi", newSalesHis})
            }
            res.status(404).send({msg: "Mahsulotni boshqa operator oldi uzur!"})
        } catch (error) {
            res.status(500).send(error);
        }
    },
    getSalesHistory: async (req, res)=> {
        try {
            const salesHis = await SalesHstory.aggregate([
                {$match: {isActive: true}},
                {
                    $lookup: {  
                        from: "orders",
                        localField: "orderId",
                        foreignField: "_id",
                        as: "orderId",
                        pipeline: [
                            {$match: {isActive: false},},
                            {
                                $lookup: {
                                    from: "products",
                                    localField: 'productId',
                                    foreignField: "_id",
                                    as: "productId",
                                }
                            },
                        ]
                        
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "operatorId",
                        foreignField: "_id",
                        as: "operatorId"
                    },
                    
                },
            ])
            res.status(200).json(salesHis);
            
        } catch (error) {
            res.status(500).send(error);
        }
    },
    getByIdAndOrder: async (req, res) => {
        const {operatorId} = req.params
        const {token} = req.headers
        try {
            if(token){  // operator qancha mahsulot olgani 
                const user = await JWT.verify(token, process.env.JWT_SECRET_KEY)
                if(user.role === "admin" || user.role === "operator"){
                    const salesHis = await SalesHstory.find({operatorId}).populate({
                        path: "operatorId",
                        select: ["name", "email", "phoneNumber"] 
                    }).populate({
                        path: "orderId",
                        select: ["price", "count", "city", "district"]
                    })
                    return res.status(200).json(salesHis)
                }
                return res.status(400).json({msg: "token not found"})
            }else{
                res.status(401).json({msg: "You have no such right"})
            }
        } catch (error) {
            res.status(500).send(error);
        }
    },
    updateSalesHis: async (req, res) => {
        const {salesHisId} = req.params
        const {token} = req.headers
        try {
            if(token){
                const user = await JWT.verify(token, process.env.JWT_SECRET_KEY)
                const salesHis = await SalesHstory.findById(salesHisId)
                if(user.role === "admin"){
                    await SalesHstory.findByIdAndUpdate(salesHisId, {isActive: false})
                    await salesHis.updateOne({$set: req.body})
                    return await res.status(200).json({msg: "product updated", salesHis})
                }
                return res.status(400).json({msg: "token not found"})
            }else{
                res.status(401).json({msg: "You have no such right"})
            }
        } catch (error) {
            res.status(500).send(error)
        }
    },
    getIsActive: async (req, res) => { // mahsulot userga yetkazilshi !
        const {token} = req.headers
        try {
            if(token){
                const user = await JWT.verify(token, process.env.JWT_SECRET_KEY)
                if(user.role === "admin" || user.role === "operator"){
                    const salesHis = await SalesHstory.find({isActive: false}).populate({
                        path: "operatorId",
                        select: ["name", "email", "phoneNumber"]     
                    }).populate({
                        path: "orderId",
                        select: ["price", "count", "city", "district"]
                    })
                    return res.status(200).json(salesHis)
                }
                return res.status(400).json({msg: "token not found"})
            }else{
                res.status(401).json({msg: "You have no such right"})
            }
        } catch (error) {
            res.status(500).send(error);
        }
    },
    deleteSalesHis: async (req, res) => {
        const {id} = req.params
        try {
           const delSaleHis = await SalesHstory.findByIdAndDelete(id)

           if(delSaleHis){
            return res.status(201).json({msg: "Product deleted", delSaleHis})
           }
           return res.status(403).json({msg: "You have no such right"})
        } catch (error) {
            res.status(500).json({msg: error})
        }
    }
}

module.exports = salesHistoryCtrl