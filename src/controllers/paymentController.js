const orderModel = require("../models/orderModel");

const stripe = require("stripe")("sk_test_51NdRM1SGor658vyKhU4S6rmJ3uwQ65oFrPHmpnCXZCDM8MAdcUA1ELMxHmnSA5j5dBYdsnOlkubMxTAAvqagiaLK00E4koTCFJ");

const payment =async(req,res,next)=>{
        try {
            let cart = req.body.cart;
          let session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],

            line_items: cart.cartItems.map((item) => ({
              price_data: {
                currency: "INR",
                product_data: {
                  name: item.productId.title,
                  images: item.productId.images,
                },
                unit_amount: item.productId.price * 100,
              },
              quantity: item.quantity,
            })),
            mode: "payment",
            success_url: `${process.env.HOST_URL}/success`,
            cancel_url: `${process.env.HOST_URL}/failed`,
          });
          
          if(req.body.form.email){
            let order = await orderModel.findOne({
              email: req.body.form.email,
              paymentStatus: "payment_pending",
            });
            if (order) {
              order.paymentId = session.id;
              await order.save();
            }
          }
          else{
              let order = await orderModel.findOne({
                userId: cart.userId,
                paymentStatus: "payment_pending",
              });
              console.log(order);
              if (order) {
                order.paymentId = session.id;
                await order.save();
              }
          }
          res.status(200).json(session);
        } catch (error) {
          next(error);
        }
}

const paymentStatus =async(req,res)=>{
        try {
            const c_id = req.body.id;
         
            let session = await stripe.checkout.sessions.retrieve(c_id);
            let paymentIntent = '';
            if(session.payment_intent){
                paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
                paymentIntent = paymentIntent.status
            }
            else{
                paymentIntent = 'payment_failed'
            }
            let order = await orderModel.findOne({ paymentId:c_id});
            if(order){
                order.paymentStatus = paymentIntent;
                await order.save();
            }
            res.status(200).json({paymentIntent:paymentIntent,orderId:order._id});
        } catch (error) {
            console.log(error);
        }
    }

    module.exports ={payment,paymentStatus}