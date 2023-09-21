const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const { getUserId } = require("./userController");


//  api to add product in cart
const addToCart = async (req, res) => {
  try {
    let productId = req.body.id;
    let userId = req.user._id;
        console.log(req.body);
    let validProduct = await productModel.findById(productId);
    if (!validProduct) {
      return res
        .status(404)
        .send({ status: false, msg: "product not found with given id" });
    }
    if (validProduct.stock === 0) {
      return res
        .status(400)
        .send({ status: false, msg: "item is not currenty available" });
    }
    let userCart = await cartModel.findOne({ userId: userId });
    //  if user has no cart
    if (!userCart) {
      let items = [{ productId, quantity: 1 }];
      let cartDetails = {
        userId,
        cartItems: items,
        totalPrice: validProduct.price.cost,
        totalItems: 1,
      };
      let newCart = await cartModel.create(cartDetails);
      return res
        .status(201)
        .send({ status: true, msg: "Items added to cart", cart: newCart });
    } 
    //  if user has cart
    else {
      let cartItemIndex = userCart.cartItems.findIndex(
        (x) => x.productId == productId
      );

      // if user added same product in cart
      if (cartItemIndex >= 0) {
        let product = userCart.cartItems[cartItemIndex];
        product.quantity += 1;
        userCart.totalPrice += validProduct.price.cost;
        userCart.totalItems += 1;
        let updatedCart = await cartModel.findByIdAndUpdate(
          userCart._id,
          userCart,
          { new: true }
        );
        return res
          .status(200)
          .send({ status: true, msg: "Item added to cart", cart: updatedCart });
      }
      // if user added different product in cart
      else {
        let cart = {};
        cart.cartItems = userCart.cartItems;
        cart.cartItems.push({ productId, quantity: 1 });
        cart.totalItems = userCart.totalItems + 1;
        cart.totalPrice = userCart.totalPrice + validProduct.price.cost;
        let updatedCart = await cartModel.findByIdAndUpdate(
          userCart._id,
          cart,
          { new: true }
        );
        return res
          .status(200)
          .send({ status: true, msg: "Item added to cart", cart: updatedCart });
      }
    }
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};


//  api to store localstorage data into database----------------------------

const addToCartFromLocalStorage = async (req, res) => {
  try {
    let userId = getUserId();
    let { cartItems } = req.body;
    let userCart = await cartModel    // getting usercart with userId
      .findOne({ userId })
      .populate("cartItems.productId");
    
      //   if user has no cart
    if (!userCart) {
      let cartDetails = {
        userId,
        cartItems: cartItems,
        totalPrice: req.body.totalPrice,
        totalItems: req.body.totalItems,
      };
      let newCart = await cartModel.create(cartDetails);
      return res
        .status(201)
        .send({ status: true, msg: "Items added to cart", cart: newCart });
    } 
    
    //  if user has already a cart
    else {
      let totalItems = 0;
      let totalPrice = 0;

    //   matching the product with productId and update its quantity
      userCart.cartItems.forEach((x) => {
        let id = x.productId._id.toString();
        if(cartItems){
           cartItems.map((y) => {
             if (y.productId._id === id) {
               x.quantity += y.quantity;
             }
           });
     }
      });

    //   for the items that are not in both it means localstorage and in cart
      cartItems.forEach((secondItem) => {
        const existingItem = userCart.cartItems.find(
          (item) =>
            item.productId._id.toString() ===
            secondItem.productId._id.toString()
        );

        if (!existingItem) {
          userCart.cartItems.push(secondItem);
        }
      });
    // updating totalPrice and totalItems of cart   
      userCart.cartItems.forEach((x) => {
        totalItems += x.quantity;
        totalPrice += x.quantity * x.productId.price;
      });
    //  updating cartDetails  
      userCart.cartItems = userCart.cartItems;
      userCart.totalPrice = totalPrice;
      userCart.totalItems = totalItems;
      userCart.save();

      return res.status(200).send({ cart: userCart });
    }
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

// getting user cart
const getUserCart = async (req, res) => {
  try {
    let userId = req.user._id;
    const cart = await cartModel
      .findOne({ userId })
      .populate("cartItems.productId");
    return res.status(200).send({ status: true, msg: "User cart", cart: cart });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

// update user cart with userId , productId and quantity
const updateCart = async (req, res) => {
  try {
    let userId = req.user._id;
    if (Object.keys(req.body).length !== 2) {
      return res.status(400).send({ status: false, msg: "invlid request" });
    }
    let { productId, quantity } = req.body;
    if (!productId) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide productId" });
    }
    let product = await productModel.findById(productId);
    if (!product) {
      return res
        .status(404)
        .send({ status: false, msg: "product not found with given Id" });
    }
    if (quantity > product.stock) {
      return res.status(404).send({
        status: false,
        msg: `maximum quantiy to buy is ${product.stock}`,
      });
    }

    // finding user cart
    let userCart = await cartModel.findOne({ userId });

    // checking if product is already present in cart
    let item = userCart.cartItems.findIndex(
      (item) => item.productId == productId
    );
    if (item === -1) {
      return res
        .status(404)
        .send({ status: false, msg: "This product not found in your cart" });
    }
    let updatedCart = {};
    const cartItem = userCart.cartItems[item];

    // if user provide 0 quantity or want to delete the product from cart
    if (quantity < 1) {
      let totalItems = userCart.totalItems - cartItem.quantity;
      let totalPrice = userCart.totalPrice - cartItem.quantity * product.price;
      let cart = await cartModel
        .findByIdAndUpdate(
          userCart._id,
          {
            $pull: { cartItems: { productId: productId } },
            $set: { totalItems, totalPrice },
          },
          { new: true }
        )
        .populate("cartItems.productId");
      return res
        .status(200)
        .send({ status: true, msg: "Item removed from cart", cart: cart });
    } 
    // if user decrease the product qauntity
    else if (quantity < cartItem.quantity) {
      updatedCart.cartItems = userCart.cartItems;
      updatedCart.totalItems = userCart.totalItems - 1;
      updatedCart.totalPrice =
        userCart.totalPrice +
        (quantity * product.price - cartItem.quantity * product.price);
      cartItem.quantity = quantity;
      let cart = await cartModel
        .findByIdAndUpdate(userCart._id, updatedCart, { new: true })
        .populate("cartItems.productId");
      return res
        .status(200)
        .send({ status: true, msg: "cart updated", cart: cart });
    }
    
    //  if user increase the product quantity
    else {
      updatedCart.cartItems = userCart.cartItems;
      updatedCart.totalItems = userCart.totalItems + 1;
      updatedCart.totalPrice =
        userCart.totalPrice +
        (quantity * product.price - cartItem.quantity * product.price);
      cartItem.quantity = quantity;
      let cart = await cartModel
        .findByIdAndUpdate(userCart._id, updatedCart, { new: true })
        .populate("cartItems.productId");
      return res
        .status(200)
        .send({ status: true, msg: "cart updated", cart: cart });
    }
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
module.exports = {
  addToCart,
  addToCartFromLocalStorage,
  getUserCart,
  updateCart,
};
