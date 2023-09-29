const orderModel = require('../models/orderModel')
const cartModel = require('../models/cartModel')
const productModel = require('../models/productModel')
const mongoose = require('mongoose')
const orderValidation = require('../validations/orderValidation')
const userModel = require('../models/userModel')
const validObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId)
}


// ------------- Create Order -----------------------------

const createOrder = async (req, res) => {
  try {
        // userId from auth middleware
    const userId = req.user._id
    let { name, phone, house, street, city, state, pincode } = req.body
    if(Object.keys(req.body).length !== 7){
        return res.status(400).send({status:false,msg:"invalid form body"})
    }
    // validating input with joi validation
      const formError = orderValidation.validate(req.body)
      if (formError.error) {
          return res.status(400).send({ msg: formError.error.details[0].message })
        }
    
        // finding user Cart with userId
    let cart = await cartModel.findOne({ userId: userId }).populate('cartItems.productId', 'stock')
    if (!cart) {
      return res.status(404).send({ status: false, msg: 'User cart not found' })
    }
    let cartItems = cart.cartItems
    //  if there is nothing in cart
    if (cartItems.length <= 0) {
      return res
        .status(400)
        .send({
          status: false,
          msg: 'Please add some items in cart to place order'
        })
    }

    // if any product is out of stock 
    const filter = cartItems.filter(x => x.quantity > x.productId.stock)
    if (filter.length > 0) {
      return res
        .status(400)
        .send({ status: false, msg: 'some product are out of stock', filter })
    }

    // order object with all details
    let order = {
      userId,
      orderDetails: {
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
        products: cartItems
      },
      shippingDetails: {
        name,
        phone,
        address: {
          house,
          street,
          city,
          state,
          pincode
        }
      }
    }

    //  creating user order
    let userOrder = await orderModel.create(order)
      // await userModel.findByIdAndUpdate(userId)
    // decreasing product stock after order place
    cartItems.forEach(async item => {
      await productModel.findByIdAndUpdate(
        item.productId._id,
        { $inc: { stock: -item.quantity } },
        { new: true }
      )
    });

    // after order clearing the cart of user
    await cartModel.findByIdAndUpdate(
      cart._id,
      { $set: { cartItems: [], totalItems: 0, totalPrice: 0 } },
      { new: true }
    );

    return res.status(200).send({ status: true, msg: 'Order Done', userOrder })
  } catch (error) {
    return res.status(500).send({ error: error.message })
  }
}

//  get user orders
const getOrder = async (req, res) => {
  try {
    let userId = req.user._id
    // getting orders that are completed and delivered
    let order = await orderModel
      .find({ userId })
      .populate('orderDetails.products.productId')
      .sort({ createdAt: -1 })
    return res.status(200).send({ status: true, msg: 'User order', order })
  } catch (error) {
    return res.status(500).send({ error: error.message })
  }
}

// get order by orderId present in params
const getOrderById = async (req, res) => {
  try {
    let orderId = req.params.orderId
    if(!validObjectId(orderId)){
        return res.status(400).send({status:false,msg:"invalid orderId"})
    }
    // getting orders that are completed and delivered
    let order = await orderModel
      .findOne({ _id: orderId })
      .populate('orderDetails.products.productId')

      // no order found 
    if (!order) {
      return res
        .status(404)
        .send({ status: false, msg: 'You have not completed any order' })
    }
    return res.status(200).send({ status: true, msg: 'Order details', order })
  } catch (error) {
    return res.status(500).send({ error: error.message })
  }
}

// cancel product in order
const cancelProductInOrder = async (req, res) => {
  try {
    let { productId } = req.body      // productId from body
    let orderId = req.params.orderId  // orderId from params
    let userId = req.user._id         // userId from auth middleware
  
    //  orderId  is not a valid ObjectId
    if (!validObjectId(orderId)) {
      return res.status(400).send({ status: false, msg: 'invlid orderId' })
    }

    if (!productId) {   // productId is not provided
      return res
        .status(400)
        .send({ status: false, msg: 'Please provide productId' });
    }
    if (!validObjectId(productId)) {  // productId is not provided
      return res.status(400).send({ status: false, msg: 'invlid productId' })
    }

    // order not found with the orderId
    let userOrder = await orderModel.findById(orderId)
    if (!userOrder) {
      return res
        .status(404)
        .send({ status: false, msg: 'order not found with this id' })
    }
    // if auth userId is not match with userOrder userId
    if (userId.valueOf() != userOrder.userId.valueOf()) {
      return res
        .status(403)
        .send({ status: false, msg: 'You cannot update this order' })
    }

    // if Order cannot update
    if (userOrder.status !== 'completed') {
      return res
        .status(400)
        .send({ status: false, msg: 'Order cannot be updated' })
    }

    // checking if product is correct 
    let product = await productModel.findById(productId)
    if (!product) {
      return res.status(404).send({ status: false, msg: 'productId invalid' })
    }

    // if all product are canceled in order
    if (userOrder.orderDetails.products.length === 0) {
      return res
        .status(400)
        .send({ status: false, msg: 'your order is already empty' })
    }
    // get quantity of removed product
    let quantity = 0
    userOrder.orderDetails.products.map(x => {
      if (x.productId.valueOf() === productId && x.canceled === false) {
        quantity = x.quantity
      }
    })
    // filtering the product that user want to delete or remove
    userOrder.orderDetails.products.map(x => {
      if (x.productId.toString() == productId) {
        x.canceled = true
      }
    })
    // updating the quantity of product in productModel
    product.stock += quantity
    await product.save()
    console.log(product.price,quantity)
    const updatedData = {};
    updatedData.products = userOrder.orderDetails.products,
    updatedData.totalItems = userOrder.orderDetails.totalItems - quantity,
    updatedData.totalPrice =
       (userOrder.orderDetails.totalPrice - product.price.cost * quantity)
        // when all products are canceled in given order then set status to canceled
        if (updatedData.totalPrice === 0) {
          let order = await orderModel.findByIdAndUpdate(
            orderId,
            {
              $set: {
                orderDetails: updatedData,
                status: 'canceled',
                canceledOn: new Date().toLocaleString()
              }
        },
        { new: true }
      );

      // returning the updated order
      return res.status(200).send({ status: true, msg: 'order updated', order });

      // when order has some product that are not canceled
    } else {
          console.log(updatedData)
      let order = await orderModel
        .findByIdAndUpdate(
          orderId,
          { $set: { orderDetails: updatedData } },
          { new: true }
        ).populate('orderDetails.products.productId');
      return res.status(200).send({ status: true, msg: 'order updated', order });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

//  cancel user order with orderId in params and userId from auth
const cancelOrder = async (req, res) => {
  try {
    // orderId of order from param 
    let orderId = req.params.orderId;

    // userId from auth middleware
    let userId = req.user._id;
 
    // orderId is not a valid ObjectId
    if (!validObjectId(orderId)) {
      return res.status(400).send({ status: false, msg: 'invlid orderId' });
    }

    // finding the order with orderId
    let userOrder = await orderModel.findById(orderId);
    if(!userOrder){
        return res.status(404).send({status:false,msg:"No order found with this id"});
    }

    // if auth userId is not match with userOrder userId
    if (userId.valueOf() != userOrder.userId.valueOf()) {
      return res
        .status(403)
        .send({
          status: false,
          msg: 'Forbidden you have not access to update this'
        });
    }
    //  if order in completed state and not in delivered or canceled
    if (userOrder.status !== 'completed') {
      return res
        .status(400)
        .send({ status: false, msg: 'Order cannot be cancel' });
    }

    //  restoring product stock after order cancel
    userOrder.orderDetails.products.forEach(async product => {
      await productModel.findByIdAndUpdate(
        product.productId,
        { $inc: { stock: +product.quantity } },
        { new: true }
      )
    })

    // change order status to canceled
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { $set: { status: 'canceled', canceledOn: new Date().toLocaleString() } },
      { new: true }
    );
    return res.status(200).send({ status: true, msg: 'order canceled', order });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

module.exports = {
  createOrder,
  getOrder,
  getOrderById,
  cancelProductInOrder,
  cancelOrder
}
