const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
   name:{
    type:String,
    required:true
   },
   category:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
   },
   price:{
    type: String,
    default: 200
   },
   operatorId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
   },
   desc:{
      type:String,
      required:true
   }
})

module.exports = mongoose.model("Product",productSchema)