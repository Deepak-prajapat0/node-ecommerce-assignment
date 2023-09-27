const { default: mongoose } = require("mongoose");
const productModel = require("../models/productModel");
const objectId = mongoose.Types.ObjectId

// adding a new product
const addNewProduct =async(req,res)=>{
    try {
        let data = req.body;
        let product = await productModel.insertMany(data);
        return res.status(201).send({status:true,msg:"product added",product})
        
    } catch (error) {
        return res.status(500).send({status:false,msg:error.message})
    }
}

// get all product
const getAllProducts =async(req,res)=>{
    try {
        let products = await productModel.find();
        return res.status(200).send({status:true,products})
        
    } catch (error) {
        return res.status(500).send({status:false,msg:error.message})
    }
}

//  get limited products
const getLimitedProducts =async(req,res)=>{
    try {
        let products = await productModel.find().limit(18);
        return res.status(200).send({status:true,products})
        
    } catch (error) {
        return res.status(500).send({status:false,msg:error.message})
    }
}

// get product by productId
const getProductById =async(req,res)=>{
    try {
        let productId = req.params.id
      let product = await productModel.findById(productId);
        if(!product){
          return res.status(404).send({status:false,msg:"Product not found with given id"})
        }
        return res.status(200).send({status:true,product})
        
    } catch (error) {
        return res.status(500).send({status:false,msg:error.message})
    }
}

const searchProduct = async (req, res) => {
  try {
    const { q } = req.query;
    const products = await productModel.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    });
    console.log(q,products)
    return res.status(200).send({status:true,products})
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  addNewProduct,
  getAllProducts,
  getLimitedProducts,
  getProductById,
  searchProduct,
};