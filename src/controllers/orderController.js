const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")
const orderValidation = require('../validations/orderValidation')


const createOrder = async(req,res)=>{
    try {
        let userId = req.userId;
        let {name,phone,house,street,city,state,pincode} = req.body;
        const inputError = orderValidation.validate(req.body);
        if(inputError.error){
            return res.status(400).send({error:inputError.error.details[0].message});
        }
        let user = await userModel.findById(userId);
        if(!user){
            return res.status(400).send({status:false,msg:"User not found"});
        }
        let cart = await cartModel.findOne({userId:userId}).populate("cartItems.productId","stock")
        if(!cart){
            return res.status(400).send({status:false,msg:"User cart not found"});
        }
        if(cart.cartItems.length <= 0){
            return res.status(400).send({status:false,msg:"Please add some items in cart to place order"});
        }
        // console.log(cart)
        // {
        //     productId: { _id: new ObjectId("64993d0c80a82c2006cf737b"), stock: 34 },
        //     quantity: 2
        //   }
        //   {
        //     productId: { _id: new ObjectId("64993d0c80a82c2006cf737a"), stock: 94 },
        //     quantity: 2
        //   }
        // let arr=[]
        // for(let item of cart.cartItems){
        //         if(item.productId.stock < item.quantity ){
        //             arr.push(item.productId._id)
        //             return res.status(400).send({status:false,msg:"some product are out of stock",arr})
        //         }
        // }

        const filter = cart.cartItems.filter(x=>x.quantity > x.productId.stock)
        if(filter.length >0){
            return res.status(400).send({status:false,msg:"some product are out of stock",filter})
        }
        let order = {
            userId,
            orderDetails:cart,
            shippingDetails:{
                name,
                phone,
                address:{
                    house,
                    street,
                    city,
                    state,
                    pincode
                }
            }

        };

        let userOrder =  await orderModel.create(order)
        // await productModel.
        // return res.status(200).send({status:true,msg:"Order Done",userOrder})
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

module.exports = {createOrder}