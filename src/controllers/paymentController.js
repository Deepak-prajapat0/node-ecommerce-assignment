const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const mailTrackId = require("../utils/mailOrderSummery");
const { getUserId } = require("./userController");

const stripe = require("stripe")("sk_test_51NdRM1SGor658vyKhU4S6rmJ3uwQ65oFrPHmpnCXZCDM8MAdcUA1ELMxHmnSA5j5dBYdsnOlkubMxTAAvqagiaLK00E4koTCFJ");
let orderDetail;

const getUserOrder = () => {
  return orderDetail;
};




const payment =async(req,res,next)=>{
        try {
            let cart = req.body.cart;
            console.log(req.body)
            // creating card session and send it to user
          let session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            //  mapping the cartitems to show on payment page
            line_items: cart.cartItems.map((item) => ({
              price_data: {
                currency: "INR",
                product_data: {
                  name: item.productId.title,
                  images: item.productId.image_url,
                },
                unit_amount: item.productId.price.cost * 100,
              },
              quantity: item.quantity,
            })),
            mode: "payment",
            success_url: `${process.env.HOST_URL}/`,
            cancel_url: `${process.env.HOST_URL}/`,
          });
          
          //  if order is placed by guest user then find it by email
          
              let order = await orderModel.findOne({
                userId: cart.userId || getUserId(),
                paymentStatus: "payment_pending",
              });
              if (order) {
                order.paymentId = session.id;
                await order.save();
              }
          
          // sending session to user
          res.status(200).json(session);
        } catch (error) {
          next(error);
        }
}


//  after payment check the payment status
const paymentStatus =async(req,res)=>{
        try {
            const c_id = req.body.id;
            // it will retrive the session from strip database
            let session = await stripe.checkout.sessions.retrieve(c_id);
            let paymentIntent = '';
            if(session.payment_intent){
                paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
                paymentIntent = paymentIntent.status
            }
            else{
                paymentIntent = 'payment_failed'
            }
            // finding order with payment Id
            let order = await orderModel.findOne({ paymentId: c_id }).populate(["orderDetails.products.productId",'userId']);
            if(order){
              // if payment failed then update the stock of product
              if(paymentIntent === 'payment_failed'){
                 order.orderDetails.products.forEach(async (item) => {
                   await productModel.findByIdAndUpdate(
                     item.productId._id,
                     { $inc: { stock: +item.quantity } },
                     { new: true }
                   );
                 });
              }
              else{
                 orderDetail =  order;
                 await mailTrackId(order.userId.email,order)
                }
                order.paymentStatus = paymentIntent;
                await order.save();
                //  order is placed by guest user then it will send a email with tracking id to user
            }
            return res.status(200).json({paymentIntent:paymentIntent,order:order});
        } catch (error) {
            console.log(error);
        }
    }

    // cs_test_a1UQs8FiUSoN5F6YcE2gwim4Urod5rk8Mqi6NqoweDNYEzF0eAMgFvNkrT;

    module.exports = { payment, paymentStatus, getUserOrder };