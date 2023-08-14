const orderModel = require("../models/orderModel");

const stripe = require("stripe")("sk_test_51NdRM1SGor658vyKhU4S6rmJ3uwQ65oFrPHmpnCXZCDM8MAdcUA1ELMxHmnSA5j5dBYdsnOlkubMxTAAvqagiaLK00E4koTCFJ");

const payment =async(req,res,next)=>{
        try {
            let items = req.body.items
          let session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            
            line_items: items.map((item) => ({
              price_data: {
                currency: "INR",
                product_data: {
                  name: item.productId.title,
                  images:item.productId.images
                },
                unit_amount: item.productId.price * 100,
              },
              quantity: item.quantity,
            })),
            mode: "payment",
            success_url: `${process.env.HOST_URL}/success`,
            cancel_url: `${process.env.HOST_URL}/failed`,
          });
          
        console.log(session.id);
          res.status(200).json(session);
        } catch (error) {
          next(error);
        }
}

const paymentStatus =async(req,res)=>{
        try {
            const c_id = req.body.id;
            console.log(req.body);
            let session = await stripe.checkout.sessions.retrieve(c_id);
            console.log("session",session.payment_status);
            let paymentIntent = '';
            if(session.payment_intent){
                paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
                console.log("paymentIntent.status",paymentIntent.status);
                paymentIntent = paymentIntent.status
            }
            else{
                paymentIntent = 'payment_failed'
            }
            let order = await orderModel.findOne({ checkout_id:c_id});
            if(order){
                order.status = paymentIntent;
                await order.save();
            }

            res.status(200).json(paymentIntent);
            // res.send("hello aashish");
        } catch (error) {
            console.log(error);
        }
    }

    module.exports ={payment,paymentStatus}