// const { getUserOrder } = require("./controllers/paymentController");
// console.log(getUserOrder);
// let order = getUserOrder()
// console.log();

// document.addEventListener("DOMContentLoaded", function () {
//   const orderId = document.querySelector(".orderId");
//   const orderDate = document.querySelector(".orderDate");
//   const addressContainer = document.querySelector(".shipping");
//   const mainDiv = document.querySelector(".products");
//   const totalItems = document.querySelector(".totalitems");
//   const totalPrice = document.querySelector(".totalprice");

 
//   orderId.innerHTML = order._id
//   orderDate.innerHTML = order.createdAt.toDateString();
//   // Function to append data to the div
//   function appendData(data) {
//     const dataDiv = document.createElement("div");
//     for (const property in data) {
//       if (property != 'address') {
//         const propertyElement = document.createElement("p");
//         propertyElement.textContent = `${property}: ${data[property]}`;
//         dataDiv.appendChild(propertyElement);
//       }
//       else{
//         for(const address in data.address){
//             const propertyElement = document.createElement("p");
//             propertyElement.textContent = `${data.address[address]}`;
//             dataDiv.appendChild(propertyElement);
//         }
//       }
//     }
//     addressContainer.appendChild(dataDiv);
//   }
//   // Call the function to append data to the div
//   appendData(order.shippingDetails);


//   // Populate the products with data
//   function populateProducts(dataArray) {
//     dataArray.forEach((data) => {
//       const product = document.createElement('div')
//       const img = document.createElement("img");
//       const title = document.createElement("h3");
//       const quantity = document.createElement("h6");
//       const price = document.createElement("h6");
//       img.src = data.productId.thumbnail;
//       img.alt = data.productId.title + " Image";
//       title.textContent = data.productId.title
//       quantity.textContent = `Qty ${data.quantity}`
//       price.textContent = `$ ${data.productId.price}`
//       product.appendChild(img);
//       product.appendChild(title);
//       product.appendChild(quantity);
//       product.appendChild(price);


//       mainDiv.appendChild(product)

//     });
//   }
//   // Call the function to populate the products with data
//   populateProducts(order.orderDetails.products);


//   totalItems.innerHTML = order.totalItems
//   totalPrice.innerHTML = order.totalPrice

// });





