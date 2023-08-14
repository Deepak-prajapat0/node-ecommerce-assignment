const router = require("express").Router();
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const cartController = require("../controllers/cartController");
const orderController = require("../controllers/orderController");
const auth = require("../middleware/auth");
const paymentController = require('../controllers/paymentController')

// user routes

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/forgetpassword", userController.forgetPassword);
router.put("/updatepassword/:emailToken", userController.updatePassword);
router.post("/logout", auth, userController.logout);
router.post("/refresh-token", userController.generateNewToken);

// product routes
router.post("/product", productController.addNewProduct);
router.get("/products/:title", productController.getProductById);
router.get("/products", productController.getAllProducts);
router.get("/best-products", productController.getLimitedProducts);

// cart route
router.post("/cart", auth, cartController.addToCart);
router.get("/cart", auth, cartController.getUserCart);
router.put("/cart-local", cartController.addToCartFromLocalStorage);
router.put("/cart", auth, cartController.updateCart);

// order route
router.post("/order", auth, orderController.createOrder);
// router.post("/create-payment-intent", orderController.payment);
router.get("/order", auth, orderController.getOrder);
router.get("/order/:orderId", auth, orderController.getOrderById);
router.put("/order/:orderId", auth, orderController.cancelProductInOrder);


router.post("/payment",paymentController.payment);
router.post("/paymentStatus", paymentController.paymentStatus);

module.exports = router;
