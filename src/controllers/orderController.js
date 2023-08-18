const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const orderValidation = require('../validations/orderValidation')
const mongoose = require('mongoose');
const userModel = require("../models/userModel");
const validObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};


const createOrder = async(req,res)=>{
    try {
        let {userId,cartItems,totalItems,totalPrice,} = req.body.order;
        let {bname,email,name,phone,house,street,city,state,pincode} = req.body.form;
        // if guest checkout
           if(email.length){
            let user = await userModel.findOne({email});
            if(user){
                return res.status(400).send({status:false,msg:"You have an account,Please login "})
            }
            const orderDetails = {
                 name: bname,
                 email,
              orderDetails: {
                totalItems: totalItems,
                totalPrice: totalPrice,
                products: cartItems,
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
            let order = await orderModel.create(orderDetails)
            cartItems.forEach(async (item) => {
              await productModel.findByIdAndUpdate(
                item.productId._id,
                { $inc: { stock: -item.quantity } },
                { new: true }
              );
            });
            return res.status(201).send({status:true,msg:"Order placed",order})
        }

        // if loggedin user place a order
        else{
        let cart = await cartModel.findOne({userId:userId}).populate("cartItems.productId","stock")
        if(!cart){
            return res.status(404).send({status:false,msg:"User cart not found"});
        }
        //  if there is nothing in cart
        if(cartItems.length <= 0){
            return res.status(400).send({status:false,msg:"Please add some items in cart to place order"});
        }
        // if any product is out of stock or user try to buy more 
        const filter = cartItems.filter(x=>x.quantity > x.productId.stock)
        if(filter.length >0){
            return res.status(400).send({status:false,msg:"some product are out of stock",filter})
        }
        let order = {
          userId,
          orderDetails: {
            totalItems: totalItems,
            totalPrice: totalPrice,
            products: cartItems,
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
        //  creating user order
        let userOrder =  await orderModel.create(order)

        // decreasing product stock after order place
        cartItems.forEach(async(item) => {
            await productModel.findByIdAndUpdate(
            item.productId._id,
            {$inc: {stock: -item.quantity}},{new:true})
        })
        await cartModel.findByIdAndUpdate(cart._id,{$set:{cartItems:[],totalItems:0,totalPrice:0}},{new:true})
        return res.status(200).send({status:true,msg:"Order Done",userOrder})
        }
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

//  get user orders
const getOrder = async(req,res)=>{
    try {
        let userId = req.user._id;
        // getting orders that are completed and delivered 
        let order = await orderModel.find({userId,status:{$in:["completed","delivered"]}}).populate("orderDetails.products.productId").sort({"createdAt": -1});
        return res.status(200).send({status:true,msg:"User order",order})
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

// get order by orderId present in params
const getOrderById = async(req,res)=>{
    try {
        let userId = req.user._id;
        let orderId = req.params.orderId;
        // getting orders that are completed and delivered 
        let order = await orderModel.findOne({_id:orderId,userId,status:{$in:["completed","delivered"]}}).populate("orderDetails.products.productId");
        if(!order){
            return res.status(404).send({status:false,msg:"You have not completed any order"})
        }
        return res.status(200).send({status:true,msg:"Order details",order})
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

//  getting order by orderId for guest users
const trackOrderById = async(req,res)=>{
    try {
        let orderId = req.params.orderId;
        if(!validObjectId(orderId)){
             return res.status(400).send({status:false,msg:"Please enter a valid orderId"})
        }
        let order = await orderModel.findOne({_id:orderId}).populate("orderDetails.products.productId");
        //  if order not found with orderId or order doesn't have email in it.
        if(!order || !order.email){
            return res.status(400).send({status:false,msg:"You have not completed any order"})
        }
        return res.status(200).send({status:true,msg:"Order details",order})
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

// cancel product in order
const cancelProductInOrder = async(req,res)=>{
    try {
        let {productId} = req.body;
        let orderId = req.params.orderId;
        let userId = req.user._id
        if(!orderId){
            return res.status(400).send({status:false,msg:"Please provide orderId"})
        }
        if (!validObjectId(orderId)) {
          return res.status(400).send({ status: false, msg: "invlid orderId" });
        }
        if(!productId){
            return res.status(400).send({status:false,msg:"Please provide productId"})
        }
        if (!validObjectId(productId)) {
          return res
            .status(400)
            .send({ status: false, msg: "invlid productId" });
        }
        let userOrder = await orderModel.findById(orderId);
        if(!userOrder){
        return res.status(404).send({status:false,msg:"order not found with this id"})
        }
        // if auth userId is not match with userOrder userId
        if(userId.valueOf() != userOrder.userId.valueOf()){
            return res.status(403).send({status:false,msg:"Forbidden you have not access to update this"})
        }
        if (userOrder.status !== "completed") {
          return res
            .status(400)
            .send({ status: false, msg: "Order cannot be updated" });
        }
        let product = await productModel.findById(productId);
        if(!product){
            return res.status(404).send({status:false,msg:"productId invalid"})
        }
        if(userOrder.orderDetails.products.length===0){
            return res.status(400).send({status:false,msg:"your order is already empty"})
        }
        // get quantity of removed product
        let quantity =0 
        userOrder.orderDetails.products.map((x)=> {
            if(x.productId.valueOf() === productId){
                quantity = x.quantity
            }
        })

        // filtering the product that user want to delete or remove
        const filteredProducts = userOrder.orderDetails.products.filter((x)=>x.productId.valueOf() !== productId)

        if(filteredProducts.length === userOrder.orderDetails.products.length){
            return res.status(404).send({status:false,msg:"given product not found in your order"})
        }

        product.stock += quantity
        await product.save();
        const updatedData ={}

        // if no products left after filteration
        if(filteredProducts.length === 0){
            updatedData.products=filteredProducts,
            updatedData.totalItems=userOrder.orderDetails.totalItems-quantity,
            updatedData.totalPrice=userOrder.orderDetails.totalPrice - product.price*quantity
            let order = await orderModel.findByIdAndUpdate(
              orderId,
              { $set: { orderDetails: updatedData, status: "canceled" } },
              { new: true }
            );
            return res.status(200).send({status:true,msg:"order canceled",order})        
        }
     
        else{
            updatedData.products=filteredProducts,
            updatedData.totalItems=userOrder.orderDetails.totalItems-quantity,
            updatedData.totalPrice=userOrder.orderDetails.totalPrice - product.price*quantity
             userOrder.orderDetails.products.forEach(async (product) => {
              let pro = await productModel.findByIdAndUpdate(
                 product._id,
                 { $inc: { stock: +product.quantity } },
                 { new: true }
               );
               console.log(pro);
             });
            const order = await orderModel.findByIdAndUpdate(orderId,{$set:{orderDetails:updatedData}},{new:true}).populate("orderDetails.products.productId")
             return res.status(200).send({status:true,msg:"product canceled",order})       
        }

    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

//  cancel user order with orderId in params and userId from auth
const cancelOrder = async(req,res)=>{
    try {
        let orderId = req.params.orderId;
        let userId = req.user._id;
        if(!orderId){
            return res.status(400).send({status:false,msg:"Please provide orderId"})
        }
        if (!validObjectId(orderId)) {
          return res.status(400).send({ status: false, msg: "invlid orderId" });
        }
        let userOrder = await orderModel.findById(orderId);

        // if auth userId is not match with userOrder userId
        if(userId.valueOf() != userOrder.userId.valueOf()){
            return res.status(403).send({status:false,msg:"Forbidden you have not access to update this"})
        }
        //  if order in completed state and not in delivered or canceled
        if(userOrder.status !== "completed"){
            return res.status(400).send({status:false,msg:"Order cannot be cancel"})
        }

        //  restoring product stock after order cancel
        userOrder.orderDetails.products.forEach(async(product)=>{
            await productModel.findByIdAndUpdate(product.productId,{$inc:{stock:+product.quantity}},{new:true})
        })
        const order = await orderModel.findByIdAndUpdate(orderId,{$set:{status:"canceled"}},{new:true})
        return res.status(200).send({status:true,msg:"order canceled",order})      
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

module.exports = {
  createOrder,
  getOrder,
  getOrderById,
  trackOrderById,
  cancelProductInOrder,
  cancelOrder,
};