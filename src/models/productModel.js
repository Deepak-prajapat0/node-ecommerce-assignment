const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title:String,
    brand:String,
    description:String,
    thumbnail:String,
    image_url:[String],
    price:{
         _id: false,
        mrp:Number,
        cost:Number,
        discount:String
    },
    features:[String],
    productDetails:[{
         _id: false,
        key:String,
        value:String
    }],
    rating:String,
    stock:Number
},{timestamps:true})

module.exports = mongoose.model('Product',productSchema)

