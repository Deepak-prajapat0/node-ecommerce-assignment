const router = require("express").Router();
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const cartController = require("../controllers/cartController");
const orderController = require("../controllers/orderController");
const auth = require("../middleware/auth");
const paymentController = require('../controllers/paymentController')
const wishlistController = require('../controllers/wishlistController')

// user routes

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/forgetpassword", userController.forgetPassword);
router.put("/updatepassword/:emailToken", userController.updatePassword);
router.post("/logout", auth, userController.logout);
router.post("/refresh-token", userController.generateNewToken);

// product routes
router.post("/product", productController.addNewProduct);
router.get("/products/search", productController.searchProduct);
router.get("/products", productController.getAllProducts);
router.get("/products/:id", productController.getProductById);
router.get("/best-products", productController.getLimitedProducts);

// cart route
router.post("/cart", auth, cartController.addToCart);
router.get("/cart", auth, cartController.getUserCart);
router.put("/cart-local", cartController.addToCartFromLocalStorage);
router.put("/cart", auth, cartController.updateCart);

// order route
router.post("/order",auth, orderController.createOrder);
router.get("/order", auth, orderController.getOrder);
router.get("/order/:id", orderController.getOrderById);
router.put("/order/:id", auth, orderController.cancelProductInOrder);
router.put("/order/cancel/:id", auth, orderController.cancelOrder);

// payment routes
router.post("/payment",auth,paymentController.payment);
router.post("/payment-status",auth,paymentController.paymentStatus);

// wishlist routes
router.post("/wishlist",auth, wishlistController.addToWishlist);
router.get("/wishlist",auth, wishlistController.getWithlist);
router.put("/wishlist",auth, wishlistController.removeFromWishlist);


module.exports = router;
