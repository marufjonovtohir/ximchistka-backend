const JWT = require("jsonwebtoken")

const Product = require("../models/productModel")
const Category = require("../models/categoryModel")
          
const ProductCtrl = {
    addProduct: async(req,res)=>{
        const {token} = req.headers
        const user = await JWT.verify(token, process.env.SECRET_KEY_JWT)
        if (user.role === "operator" || user.role === "admin") {
            const {name,price, category:categoryId,  desc } = req.body
            try {
                const newProduct = await Product({operatorId:user.id, name, price,category:categoryId,desc})
        
                await newProduct.save()
                
                res.status(201).json({msg: "New Product created succesfully",newProduct})
            } catch (error) {
                res.status(403).json(msg.error.message)
            }
        }else{
            res.status(400).json({message: "product created Operator or Admin "})
        }
    },
     deleteProduct: async(req,res) => {
        try {
            const {id} = req.params
            const product =await Product.findByIdAndDelete(id)
            if (product) {
                return res.status(200).json({msg: `${product.name} product deleted!`})
            }
            res.status(404).json({msg: `product not found`})
        } catch (error) {
            res.send({msg: error.message})
        }
     },
     getAllProducts: async(req,res) => {
        try {
            const {token} = req.headers
            if (token) {
                const user = await JWT.verify(token, process.env.SECRET_KEY_JWT)
                if (user.role === 'admin') {
                    const products = await Product.find().populate({
                        path: "operatorId",
                        select: ['name', 'email','phoneNumber','role']
                    }).populate('category','title')

                    res.status(200).json({msg: "productlar royxati", products})
                }else{
                    const products = await Product.find().populate({
                        path:'operatorId',
                        select:['name','email','phoneNumber']
                    }).populate('category','title')
                    res.status(200).json({msg:"porductlar royhati ", products})
                }
            }else{
                const products = await Product.find().populate({
                    path:'operatorId',
                     select:['name','email','phoneNumber']
                    }).populate('category','title')
                res.status(200).json(products)
            }
        } catch (error) {
            res.send({msg: error.message})
        }
     },
      getProductsByCategory: async(req,res) => {
        try {
            const {token} = req.headers
            const {categoryId} =req.params
            const user = await JWT.verify(token, process.env.SECRET_KEY_JWT)
            if (user.role === 'admin') {
                const products = await Product.find({category:categoryId})
                res.status(200).json({msg:"productlar royhati", products})
            }else{
                const products = await Product.find($and[{isPublished: true}, {category:categoryId}])
                res.status(200).json({msg: "productlar ro'yhati", products})
            }
        } catch (error) {
            res.send({msg: error.message})
        }
      },
      getProductById: async(req,res) => {
          const {id} = req.params
          const {token} = req.headers
        try {
            if (token) {
               const user = await JWT.verify(token, procces.env.SECRET_KEY_JWT)
               if (user.role === "admin") {
                const product = await Product.find({operatorId}.populate({
                    path:"operatorId",
                    select:["role", "email", "phone", "firstname", "lastname"]
                }))
                return res.status(201).json(product)
               }
               return res.status(201).json({msg:"You have that right!"})
            }else{
                res.status(404).json({msg:"JWT not found"})

            }
        } catch (error) {
            res.send({msg: error.message})
        }
      }
}


module.exports = ProductCtrl