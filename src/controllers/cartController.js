const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");

const addToCart = async(req,res)=>{
    try {
        let productId = req.body.productId;
        let userId = req.user._id;
        let validProduct = await productModel.findById(productId);
        if(!validProduct){
            return res.status(400).send({status:false,msg:"product not found with given id"})
        }
        let userCart = await cartModel.findOne({userId:userId});
        if(!userCart){
            let items = [{productId,quantity:1}];
            let cartDetails ={ userId,cartItems:items,totalPrice:validProduct.price,totalItems:1}
            let newCart = await cartModel.create(cartDetails);
            return res.status(201).send({status:true,msg:"Items added to cart",newCart})
        }
        else{
            let cart = {};
            let cartItemIndex = userCart.cartItems.findIndex(x=>x.productId==productId)
            if(cartItemIndex >=0){
                let product = userCart.cartItems[cartItemIndex]
                product.quantity+=1;
                userCart.totalPrice+=validProduct.price;
                 let updated = await cartModel.findByIdAndUpdate(userCart._id,userCart,{new:true})
                return res.status(200).send(updated)
            }
            else{
                cart.cartItems = userCart.cartItems;
                cart.cartItems.push({productId,quantity:1})
                cart.totalItems = userCart.cartItems.length;
                cart.totalPrice = userCart.totalPrice+validProduct.price
                let updated= await cartModel.findByIdAndUpdate(userCart._id,cart,{new:true})
                return res.status(200).send(updated)
            }
        }

        
    } catch (error) {
        return res.status(500).send({status:false,error:error.message})
    }
}

module.exports ={addToCart}