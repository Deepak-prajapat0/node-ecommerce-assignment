const router = require("express").Router();
const userController = require("../controllers/userController")
const productController = require("../controllers/productController")
const cartController = require("../controllers/cartController");
const orderController = require("../controllers/orderController")
const auth = require("../middleware/auth")


router.post('/register',userController.registerUser)
router.post('/login',userController.loginUser)
router.post('/forgetpassword',userController.forgetPassword)
router.put('/updatepassword/:emailToken',userController.updatePassword)
router.get('/logout',userController.logout)


router.post('/product',productController.addNewProduct)

router.post('/cart/add',auth,cartController.addToCart)

router.post('/order',auth,orderController.createOrder)
module.exports = router