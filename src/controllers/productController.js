const productModel = require("../models/productModel");

const addNewProduct =async(req,res)=>{
    try {
        let data = req.body;
        let product = await productModel.insertMany(data);
        return res.status(201).send({status:true,msg:"product added",product})
        
    } catch (error) {
        return res.status(500).send({status:false,msg:error.message})
    }
}
const getAllProducts =async(req,res)=>{
    try {
        let products = await productModel.find();
        return res.status(200).send({status:true,products})
        
    } catch (error) {
        return res.status(500).send({status:false,msg:error.message})
    }
}
const getLimitedProducts =async(req,res)=>{
    try {
        let products = await productModel.find().limit(18);
        return res.status(200).send({status:true,products})
        
    } catch (error) {
        return res.status(500).send({status:false,msg:error.message})
    }
}
const getProductById =async(req,res)=>{
    try {
        let id = req.params.id
        let product = await productModel.findById(id);
        return res.status(200).send({status:true,product})
        
    } catch (error) {
        return res.status(500).send({status:false,msg:error.message})
    }
}

module.exports = {
  addNewProduct,
  getAllProducts,
  getLimitedProducts,
  getProductById,
};