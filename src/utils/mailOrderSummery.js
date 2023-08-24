const nodemailer = require("nodemailer");

// function generateOrderSummaryHTML(order) {
//   return `
//  <html lang="en">
// <head>
//     <style>
//     body {
//   padding: 1rem;
//   margin: 2rem;
//   height: 100vh;
//   max-width: 100vw;
//   overflow-x: hidden;
//   color: rgb(51, 51, 51);
//   background-color: white;
//   display: flex;
//   flex-direction: column;
// }
// .orderDetails{
//     width: 100%;
//     display: flex;
//     flex-direction: row;
//     justify-content: space-around;
//     text-align: center;
// }
// .orderDetails .box{
//     display: flex;
//     flex-direction: column;
//     gap: 5px;
// }

// .products >div{
//     padding: 5px 1rem;
//     display: flex;
//     flex-direction: row;
//     justify-content: space-between;
//     align-items: center;
//     border: 1px solid lightgray;
// }
// .products img{
//     height: 5rem;
//     width: 6rem;
//     border: 1px solid lightgray;
//     border-radius: 10px;
// }

// .products h3, .products h4{
//         font-size: 14px;
// }

//     </style>

// </head>
// <body>
//     <div class="headings">
//         <h1>Your Order Confirmed!</h1>
//         <h2 class="customerName">Hi Deepak</h2>
//         <h3>Your order has been confirmed and will be shipping soon.</h3>
//     </div>
//     <hr style="width: 100%;">
//     <div class="orderDetails">
//         <div class="box">
//             <span>Order Date</span>
//             <span class="orderDate">${order.createdAt.toLocaleString()}</span>
//         </div>
//         <div class="box">
//             <span>Order Id</span>
//             <span class="orderId">${order._id}</span>
//         </div>
//         <div class="box">
//             <span>Payment Method</span>
//             <span>Card</span>
//         </div>
//         <div class="box">
//             <span>Shipping Detail</span>
//             <span class="shipping">${JSON.stringify(
//               order.shippingDetails
//             )}</span>
//         </div>
//     </div>
//     <hr style="width: 100%;">
//     <div class="mainContainer">
//         <div class="products">
//         </div>
//         <div class="totalSummery">
//             <h4>Total</h4>
//             <h6 class="totalitems"></h6>
//             <h6 class="totalprice"></h6>
//         </div>
//     </div>
// </body>
// </html>

//     `;
// }
// let h ={
//   orderDetails: { products: [ [Object] ], totalItems: 1, totalPrice: 23 },
//   shippingDetails: {
//     address: {
//       house: '2121',
//       street: 'New market',
//       city: 'Panipat',
//       state: 'Bihar',
//       pincode: 132103
//     },
//     name: 'Deepak',
//     phone: 8956456512
//   },
//   _id: "64e7448e9258a704591d4d9e",
//   userId: {
//     _id: "64e4b7472a8b07859f1e9d02",
//     name: 'Deepak',
//     email: 'deepak.prajapat@rudrainnovative.in',
//     password: '$2b$10$8bhfPSLW2piqb24lri/Ol.5order.sy.ZoNTd9KaPHvAE7tMq.zEelbDG',
//     emailToken: '13a52e11dc6713774eac67cf4ba972',
//     emailTokenExp: "2023-08-24T11:51:39.585Z",
//     tokens: [ [Object] ],
//     createdAt: "2023-08-22T13:25:27.306Z",
//     updatedAt: "2023-08-24T11:46:52.221Z",
//     __v: 0
//   },
//   status: 'completed',
//   paymentStatus: 'payment_pending',
//   paymentId: 'cs_test_a1zjwST7Lk3Y3UenZydxVCnuTFYa5dzECykHJGcWgfrVxk9JmBJoSFTMPd',
//   createdAt: "2023-08-24T11:52:46.955Z",
//   updatedAt: "2023-08-24T11:52:48.751Z",
//   __v: 0
// }

const mailTrackId = async (email, order) => {
  console.log(email);
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 587,
      auth: {
        user: "deepak.prajapat@rudrainnovative.in",
        pass: "nzwcdbrebdsdqwtk",
      },
    });

    let success = await transporter.sendMail({
      from: "deepak.prajapat@rudrainnovative.in",
      to: email,
      subject: "Thank you for ordering.",
      html: `
    <div class="headings" style="background-color: red;">
        <h1>Your Order Confirmed!</h1>
        <h2 class="customerName">Hi Deepak</h2>
        <h3>Your order has been confirmed and will be shipping soon.</h3>
    </div>
    <hr style="width: 100%;">
    <div style="padding:"2rem"; display:flex; flex-direction:row; text-align: center;">
        <div style="display:flex; flex-direction:column; background-color: skyblue;">
            <h4>Order Date</h4>
            <h4 class="orderDate">${order.createdAt.toLocaleString()}</h4>
        </div>
        <div style="display:flex; flex-direction:column;">
            <h4>Order Id</h4>
            <h4 class="orderId">${order._id}</h4>
        </div>
        <div style="display:flex; flex-direction:column;">
            <h4>Payment Method</h4>
            <h4>Card</h4>
        </div>
        <div style="display:flex; flex-direction:column;">
            <h4>Shipping Detail</h4>
            <h4 class="shipping">${JSON.stringify(order.shippingDetails)}</h4>
        </div>
    </div>
    `,
    });
    if (success) {
      return success;
    }
  } catch (error) {
    return error;
  }
};

// mailTrackId("birendra@rudrainnovative.in", h).then(res=>{
//   console.log(res);
// })

module.exports = mailTrackId;
