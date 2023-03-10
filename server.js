const express = require ('express');
const  dotenv = require ('dotenv');
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const cors = require('cors')

const userRoute = require("./src/rotes/userRoute")
const categoryRoute =require("./src/rotes/categoryRoute")
const productRoute = require("./src/rotes/productRoute")
const orderRoute = require("./src/rotes/orderRoute")
const salesHisRoute = require("./src/rotes/salesHisRoute")


dotenv.config()
const app = express()


const PORT = process.env.PORT || 4000
const MONGO_URL  = process.env.MONGO_URL

//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(fileUpload())
app.use(cors())

//Routes
app.use("/user",userRoute)
app.use("/category",categoryRoute)
app.use("/product",productRoute)
app.use("/order",orderRoute)
app.use("/salesHis",salesHisRoute)



app.get('/', (req,res) =>{
    res.send("home")
})


mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    app.listen(PORT, ()=> console.log(`Server started on port:${PORT}`))
}).catch((error) => console.log(error))

