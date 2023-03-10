const JWT = require ("jsonwebtoken")

const Category = require("../models/categoryModel")

const categoryCtrl = {
createCategory: async(req,res) => {
    try {
        const{title}=req.body
        const newCategory = await Category({title})
        await newCategory.save()
        res.status(201).json({msg:"category created succesfully"})
    } catch (error) {
        res.send({msg: error.message})
    }
},
getListCategory: async(req,res) => {
    try {
    const categories = await Category.find()
    res.status(200).json({msg:'',categories})
} catch (error) {
    res.send({msg: error.message})
}
},
deleteCategory: async(req,res) => {
    try {
        const {id} =req.params
        const category = await Category.findByIdAndDelete(id)
        if (category) {
            return res.status(200).josn({msg: `${category.title} category deleted!` })
        }

        res.status(404).json({msg: `category not found`})
    } catch (error) {
        res.send({msg: error.message})
    }
},
updateCategory: async(req,res) => {
    try {
        const {token} = req.headers

        const user = await  JWT.verify(token,process.env.SECRET_KEY_JWT)

        if (user.role === 'admin') {
            const {id} = req.params
            const {title} = req.body
            const Category  = await Category.findByIdAndUpdate(id, {title})

            if (category) {
                return res.status(200).json({msg: `${category.title} category updated`})
            }
            
            res.status(403).json({msg: `category not found`})
        }else{
            res.status(403).json({msg: `Not Allowed`})
        }
    } catch (error) {
        res.send({msg: error.message})
    }
}
}


module.exports = categoryCtrl