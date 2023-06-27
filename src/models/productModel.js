const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title:String,
    brand:String,
    description:String,
    category:String,
    price:Number,
    rating:String,
    stock:Number
},{timestamps:true})

module.exports = mongoose.model('Product',productSchema)


