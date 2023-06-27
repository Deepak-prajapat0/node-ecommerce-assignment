const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const orderValidation = require('../validations/orderValidation')


const createOrder = async(req,res)=>{
    try {
        let userId = req.user._id;
        let {name,phone,house,street,city,state,pincode} = req.body;
        const inputError = orderValidation.validate(req.body);
        if(inputError.error){
            return res.status(400).send({error:inputError.error.details[0].message});
        }
        let cart = await cartModel.findOne({userId:userId}).populate("cartItems.productId","stock")
        if(!cart){
            return res.status(404).send({status:false,msg:"User cart not found"});
        }
        if(cart.cartItems.length <= 0){
            return res.status(400).send({status:false,msg:"Please add some items in cart to place order"});
        }
        const filter = cart.cartItems.filter(x=>x.quantity > x.productId.stock)
        if(filter.length >0){
            return res.status(400).send({status:false,msg:"some product are out of stock",filter})
        }
        let order = {
          userId,
          orderDetails: {
            totalItems: cart.totalItems,
            totalPrice: cart.totalPrice,
            products: cart.cartItems,
          },
          shippingDetails: {
            name,
            phone,
            address: {
              house,
              street,
              city,
              state,
              pincode,
            },
          },
        };
        let userOrder =  await orderModel.create(order)
        cart.cartItems.forEach(async(item) => {
            await productModel.findByIdAndUpdate(
            item.productId._id,
            {$inc: {stock: -item.quantity}},{new:true})
        })
        await cartModel.findByIdAndUpdate(cart._id,{$set:{cartItems:[],totalItems:0,totalPrice:0}},{new:true})
        return res.status(200).send({status:true,msg:"Order Done",userOrder})
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

const getOrder = async(req,res)=>{
    try {
        let userId = req.user._id;
        let order = await orderModel.findOne({userId}).populate("orderDetails.products.productId");
        if(!order){
            return res.status(404).send({status:false,msg:"You didn't place any orders yet"})
        }
        return res.status(200).send({status:true,msg:"User order",order})
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

module.exports = {createOrder,getOrder}