// const { getUserOrder } = require("./controllers/paymentController");
// console.log(getUserOrder);
// let order = getUserOrder()

// let orderId = order._id;
// let orderStatus = order.status
// let products= order.products; // array of products in order
// let totalPrice = order.totalPrice;
// let totalItems = order.totalItems;
// let shippingDetails = order.shippingDetails;
// let address = order.shippingDetails.address;

// /*
// {
//         "orderDetails": {
//             "products": [
//                 {
//                     "productId": {
//                         "_id": "64c77eeacce3b1afb1c5b7e3",
//                         "title": "Samsung Universe 9",
//                         "description": "Samsung's new variant which goes beyond Galaxy to the Universe",
//                         "price": 12490,
//                         "discountPercentage": 15.46,
//                         "rating": "4.09",
//                         "stock": 38,
//                         "brand": "Samsung",
//                         "category": "smartphones",
//                         "thumbnail": "https://i.dummyjson.com/data/products/3/thumbnail.jpg",
//                         "images": [
//                             "https://i.dummyjson.com/data/products/3/1.jpg"
//                         ],
//                         "updatedAt": "2023-08-24T05:41:39.736Z"
//                     },
//                     "quantity": 1,
//                     "canceled": false
//                 }
//             ],
//             "totalItems": 1,
//             "totalPrice": 12490
//         },
//         "shippingDetails": {
//             "address": {
//                 "house": "2121",
//                 "street": "New market",
//                 "city": "Panipat",
//                 "state": "Bihar",
//                 "pincode": 132103
//             },
//             "name": "Deepak",
//             "phone": 8956456512
//         },
//         "_id": "64e6ed930175210b6d6d966e",
//         "userId": "64d5e7c5c620302716aa3ca7",
//         "status": "completed",
//         "paymentStatus": "succeeded",
//         "paymentId": "cs_test_a1Nb1vz3UZ5QejSHpPYHdCBT6Vir1pED93BN9iCkqBjJte3DnXeqcTapmh",
//         "createdAt": "2023-08-24T05:41:39.447Z",
//         "updatedAt": "2023-08-24T05:42:04.418Z",
//         "__v": 0
//     }
// */
document.addEventListener("DOMContentLoaded", function () {
  const dataTable = document.querySelector(".mainContainer");
  const addressContainer = document.querySelector(".shipping");
  const orderId = document.querySelector(".orderId");
  const type = document.querySelector('.type');

  const shippingDetails = {
    address: {
      house: "2121",
      street: "New market",
      city: "Panipat",
      state: "Bihar",
      pincode: 132103,
    },
    name: "Deepak",
    phone: 8956456512,
  };

  // Sample data array
  const sampleData = [
    {
      productId: {
        _id: "64c77eeacce3b1afb1c5b7e3",
        title: "Samsung Universe 9",
        description:
          "Samsung's new variant which goes beyond Galaxy to the Universe",
        price: 12490,
        discountPercentage: 15.46,
        rating: "4.09",
        stock: 38,
        brand: "Samsung",
        category: "smartphones",
        thumbnail: "https://i.dummyjson.com/data/products/3/thumbnail.jpg",
        images: ["https://i.dummyjson.com/data/products/3/1.jpg"],
        updatedAt: "2023-08-24T05:41:39.736Z",
      },
      quantity: 1,
      canceled: false,
    },
    {
      productId: {
        _id: "64c77eeacce3b1afb1c5b7e3",
        title: "Samsung Universe 9",
        description:
          "Samsung's new variant which goes beyond Galaxy to the Universe",
        price: 12490,
        discountPercentage: 15.46,
        rating: "4.09",
        stock: 38,
        brand: "Samsung",
        category: "smartphones",
        thumbnail: "https://i.dummyjson.com/data/products/3/thumbnail.jpg",
        images: ["https://i.dummyjson.com/data/products/3/1.jpg"],
        updatedAt: "2023-08-24T05:41:39.736Z",
      },
      quantity: 1,
      canceled: false,
    },
    {
      productId: {
        _id: "64c77eeacce3b1afb1c5b7e3",
        title: "Samsung Universe 9",
        description:
          "Samsung's new variant which goes beyond Galaxy to the Universe",
        price: 12490,
        discountPercentage: 15.46,
        rating: "4.09",
        stock: 38,
        brand: "Samsung",
        category: "smartphones",
        thumbnail: "https://i.dummyjson.com/data/products/3/thumbnail.jpg",
        images: ["https://i.dummyjson.com/data/products/3/1.jpg"],
        updatedAt: "2023-08-24T05:41:39.736Z",
      },
      quantity: 1,
      canceled: false,
    },
  ];
 
  // Sample data object
  const userData = {
    name: "Deepak",
    phone: 8956456512,
    house: "2121",
    address: {
      street: "New market",
      city: "Panipat",
      state: "Bihar",
      pincode: 132103,
    },
  }; 

 
  orderId.textContent = "64e6ed930175210b6d6d966e";
  
  // Function to append data to the div
  function appendData(data) {
    const dataDiv = document.createElement("div");
    for (const property in data) {
      if (property != 'address') {
        const propertyElement = document.createElement("p");
        propertyElement.textContent = `${property}: ${data[property]}`;
        dataDiv.appendChild(propertyElement);
      }
      else{
        for(const address in data.address){
            const propertyElement = document.createElement("p");
            propertyElement.textContent = `${data.address[address]}`;
            dataDiv.appendChild(propertyElement);
        }
      }
    }
    addressContainer.appendChild(dataDiv);
  }
  // Call the function to append data to the div
  appendData(userData);



  // Populate the products with data
  function populateProducts(dataArray) {
    const mainDiv = dataTable.querySelector(".products");

    dataArray.forEach((data) => {
      const imageElement = document.createElement("img");
      imageElement.src = data.productId.thumbnail;
      imageElement.alt = data.productId.title + " Image";
      imageElement.width = 50; 
      imageElement.height = 50;
    });
  }
  // Call the function to populate the products with data
  populateProducts(sampleData);
});
