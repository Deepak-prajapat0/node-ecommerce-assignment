const router = require("express").Router();
const userController = require("../controllers/userController")
const productController = require("../controllers/productController")
const cartController = require("../controllers/cartController");
const orderController = require("../controllers/orderController")
const auth = require("../middleware/auth")


// user routes

router.post('/register',userController.registerUser)
router.post('/login',userController.loginUser)
router.post('/forgetpassword',userController.forgetPassword)
router.put('/updatepassword/:emailToken',userController.updatePassword)
router.post('/logout',auth,userController.logout)

// product routes
router.post('/product',productController.addNewProduct)

// cart route
router.post('/cart/add',auth,cartController.addToCart)

// order route
router.post('/order',auth,orderController.createOrder)
module.exports = router