const { registerUser, registerUserBody, loginUser, loginUserBody, forgotPassword, forgotPasswordBody, updatePassword, updatePasswordBody, logOut } = require('./userDoc')
const { createCart, createCartBody, getUserCart } = require('./cartDoc')

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
      url: 'http://localhost:3001',
      description: 'Development server',
    },
  ],
  paths: {
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

    // cart api's

    '/cart': {
      post: createCart,
    },
    '/cart': {
      get: getUserCart,
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      registerUserBody,
      loginUserBody,
      forgotPasswordBody,
      updatePasswordBody,
      createCartBody
    },
  },
};

module.exports = { swaggerDefinition }