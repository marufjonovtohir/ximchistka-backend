const bcrypt =require("bcrypt")
const { json } = require("express")
const JWT = require ("jsonwebtoken")

const User = require("../models/userModel")

const userCtrl = {
createuser: async(req,res) => {
    try {
        const {name, password, email, phoneNumber, role} = req.body

        if(!name || !password || !email || !phoneNumber ||!role ) {
            return res.status(400).json({msg: "Please fill all lines"})
        }

        const checkUser = await User.findOne({email})

        if(checkUser) {
            return res.status(403).send({msg: "This email already exist!"})
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)
        
        
        const newUser = await User({name,password: hashedPassword, email, phoneNumber, role})
        
        await newUser.save()
  
        res.status(201).send({msg: "Signup successfully!"})
      
        
    } catch (error) {
        res.json({msg: error.message})
    }
},
login : async(req,res)=>{
try {
    const {email, password} =req.body
    if (!email || !password) {
        return res.status(400).json({msg: "Please fill all lines"})
    }
    const user = await User.findOne({email})
    if (user) {
        const verifyPass =await bcrypt.compare(password, user.password)

        if (verifyPass) {
            const token = await  JWT.sign({id: user.id, name: user.name, phoneNumber: user.phoneNumber, role: user.role},process.env.SECRET_KEY_JWT,{expiresIn:'2h'})

            return res.status(200).json({msg:"Login successfuly", token})
        }
        return res.status(400).json({msg:"Email or password incorrect"})
    }
    res.status(400).json({msg:"User not found"})
} catch (error) {
    res.send({msg: error.message})
}
},
getAllUsers: async (req, res) => {
    try {
        const users = await User.find({})

        res.status(200).json({message: "All users", users})
    } catch (error) {
        res.status(403).json(error)
    }
},
getAllOperators: async(req, res) => {
    try {
        const users = await User.find({role: "operator"})

        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({message: error})
    }
},
delUser: async(req, res) => {
    const {id} = req.params
    const deluserId = await User.findByIdAndDelete(id)
    try {
        if(deluserId){
            res.status(201).json({message: "User deleted", deluserId})
        }
    } catch (error) {
        res.status(500).json(error.message)
    }
}
}


module.exports = userCtrl