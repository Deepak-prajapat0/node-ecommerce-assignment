const { registerUser, registerUserBody, loginUser, loginUserBody, forgotPassword, forgotPasswordBody, updatePassword, updatePasswordBody, logOut } = require('./userDoc')
const { createCart, createCartBody,getUserCart ,updateUserCart,updateCartBody} = require('./cartDoc');
const {createOrder,createOrderBody, getUserOrder, getOrderWithId,cancelProductBody,cancelProductInOrder, cancelOrder}= require('./orderDoc')
const{getAllProducts,getProductById,getSearchedProduct} = require('./productDoc')

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for JSONPlaceholder',
    version: '1.0.0',
    description:
      'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'JSONPlaceholder',
      url: 'https://jsonplaceholder.typicode.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Development server',
    },
    {
      url: 'https://react-ecommerce-api-bwv0.onrender.com',
      description: 'Live server',
    },
  ],
  paths: {

    // user api routes 

    '/register': {
      post: registerUser,
    },
    '/login': {
      post: loginUser,
    },
    '/forgetpassword': {
      post: forgotPassword,
    },
    '/updatepassword/{emailToken}': {
      put: updatePassword,
    },
    '/logout': {
      post: logOut,
    },

    // product api route

    '/products':{
      get:getAllProducts
    },
    '/best-products':{
      get:getAllProducts
    },
    '/products/{id}':{
      get: getProductById
    },
    '/products/search':{
      get: getSearchedProduct
    },

    // cart api route

    '/cart': {
      post: createCart,
      get: getUserCart,
      put: updateUserCart
    },

    // order api route 

    '/order': {
      post: createOrder,
      get: getUserOrder,
    },
    "/order/{orderId}":{
      get:getOrderWithId,
      put:cancelProductInOrder
    },
    "/order/cancel/{orderId}":{
      put:cancelOrder
    }
  },
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "X-API-KEY",
      },
    },
    schemas: {
      registerUserBody,
      loginUserBody,
      forgotPasswordBody,
      updatePasswordBody,
      createCartBody,
      updateCartBody,
      createOrderBody,
      cancelProductBody
    },
  },
};

module.exports = { swaggerDefinition }