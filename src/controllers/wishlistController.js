const wishlistModel = require("../models/wishlistModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");

const addToWishlist=async(req,res)=>{
    try {
        let productId = req.body.productId;
        let userId = req.user._id;
        if(!productId){
            return res.status(400).send({status:false,msg:"Invalid request body"})
        }
        let product = await productModel.findById(productId);
        if(!product){
            return res.status(404).send({status:false,msg:"Invalid productId"})
        }
        let user = await userModel.findById(userId);
        if(!user){
            return res.status(400).send({status:false,msg:"Invalid userId or token"})
        }
        let userWishlist = await wishlistModel.findOne({userId});
        if(!userWishlist){
            let wishlist = await wishlistModel.create({userId,products:[productId]})
            return res.status(201).send({status:true,msg:"Added to wishlist",wishlist})
        }
        else{
            let products = userWishlist.products
             let previouslyAdded = products.findIndex(
               (x) => x == productId
             );
             if(previouslyAdded !== -1){
                return res.status(400).send({status:false,msg:"This product is already in your wishlist"})
             }
            products.push(productId)
            let wishlist = await wishlistModel.findByIdAndUpdate(userWishlist._id,{$set:{products:products}},{new:true}).populate('products')
            return res.status(200).send({status:true,msg:"Added to wishlist",wishlist})

        }
    } catch (error) {
        return res.status(500).send({status:false,msg:error.message})
    }

}



const getWithlist=async(req,res)=>{
    try {
        let userId = req.user._id;
        let wishlist = await wishlistModel.findOne({userId:userId}).populate("products");
        return res.status(200).send({status:true,wishlist})
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message });
        
    }
}
const removeFromWishlist=async(req,res)=>{
    try {
        let userId = req.user._id;
        let productId = req.body.productId
        if(!productId){
            return res.status(400).send({status:false,msg:"Please provied productId"})
        }
        let userWishlist = await wishlistModel.findOne({userId:userId});
        let filteredList = userWishlist.products.filter((x) => x.toString() !== productId.toString());
        console.log(filteredList);
        let wishlist = await wishlistModel.findByIdAndUpdate(userWishlist._id,{$set:{products:filteredList}},{new:true}).populate("products")
        return res.status(200).send({status:true,wishlist})
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message });
        
    }
}
// const getWithlist=async(req,res)=>{
//     try {
//         let userId = req.user._id;
//         let wishlist = await wishlistModel.findOne({userId:userId}).populate("products");
//         return res.status(200).send({status:false,wishlist})
//     } catch (error) {
//         return res.status(500).send({ status: false, msg: error.message });
        
//     }
// }

module.exports = { addToWishlist, getWithlist, removeFromWishlist };