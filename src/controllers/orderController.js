const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const orderValidation = require('../validations/orderValidation')
const ObjectId = require("mongoose").Types.ObjectId


const createOrder = async(req,res)=>{
    try {
        let {userId,cartItems,totalItems,totalPrice,} = req.body.order;
        let {bname,email,name,phone,house,street,city,state,pincode} = req.body.form;
        // const inputError = orderValidation.validate(req.body.form);
        // if(inputError.error){
        //     return res.status(400).send({error:inputError.error.details[0].message});
        // }

        if(email.length){
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
        else{

        
        let cart = await cartModel.findOne({userId:userId}).populate("cartItems.productId","stock")
        if(!cart){
            return res.status(404).send({status:false,msg:"User cart not found"});
        }
        if(cartItems.length <= 0){
            return res.status(400).send({status:false,msg:"Please add some items in cart to place order"});
        }
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
        let userOrder =  await orderModel.create(order)
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

const getOrder = async(req,res)=>{
    try {
        let userId = req.user._id;
        let order = await orderModel.find({userId,status:{$in:["pending","delivered"]}}).populate("orderDetails.products.productId").sort({"createdAt": -1});
        return res.status(200).send({status:true,msg:"User order",order})
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

const getOrderById = async(req,res)=>{
    try {
        let userId = req.user._id;
        let orderId = req.params.orderId;
        let order = await orderModel.findOne({_id:orderId,userId,status:{$in:["pending","delivered"]}}).populate("orderDetails.products.productId");
        if(!order){
            return res.status(404).send({status:false,msg:"You have not completed any order"})
        }
        return res.status(200).send({status:true,msg:"Order details",order})
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

const cancelProductInOrder = async(req,res)=>{
    try {
        let {productId} = req.body;
        let orderId = req.params.orderId;
        let userId = req.user._id
        if(!orderId){
            return res.status(400).send({status:false,msg:"Please provide orderId"})
        }
        if (!ObjectId.isValid(orderId)) {
            return res.status(400).send({status:false,msg:"invlid orderId"})
        }
        if(!productId){
            return res.status(400).send({status:false,msg:"Please provide productId"})
        }
        if (!ObjectId.isValid(productId)) {
            return res.status(400).send({status:false,msg:"invlid productId"})
        }
        let userOrder = await orderModel.findById(orderId);
        if(!userOrder){
        return res.status(404).send({status:false,msg:"order not found with this id"})
        }

        if(userId.valueOf() != userOrder.userId.valueOf()){
            return res.status(403).send({status:false,msg:"Forbidden you have not access to update this"})
        }
        if(userOrder.status !== "pending"){
            return res.status(400).send({status:false,msg:"Order cannot be updated"})
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
            return res.status(200).send({status:true,msg:"order cancled",order})        
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
             return res.status(200).send({status:true,msg:"product cancled",order})       
        }

    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

const cancelOrder = async(req,res)=>{
    try {
        let orderId = req.params.orderId;
        let userId = req.user._id;
        if(!orderId){
            return res.status(400).send({status:false,msg:"Please provide orderId"})
        }
        if (!ObjectId.isValid(orderId)) {
            return res.status(400).send({status:false,msg:"invlid orderId"})
        }
        let userOrder = await orderModel.findById(orderId);

        if(userId.valueOf() != userOrder.userId.valueOf()){
            return res.status(403).send({status:false,msg:"Forbidden you have not access to update this"})
        }
        if(userOrder.status !== "pending"){
            return res.status(400).send({status:false,msg:"Order cannot be cancel"})
        }
        userOrder.orderDetails.products.forEach(async(product)=>{
            await productModel.findByIdAndUpdate(product.productId,{$inc:{stock:+product.quantity}},{new:true})
        })
        const order = await orderModel.findByIdAndUpdate(orderId,{$set:{status:"canceled"}},{new:true})
        return res.status(200).send({status:true,msg:"order cancled",order})      
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}



module.exports = {
  createOrder,
  getOrder,
  getOrderById,
  cancelProductInOrder,
  cancelOrder,
};