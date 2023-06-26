const productModel = require("../models/productModel");

const addNewProduct =async(req,res)=>{
    try {
        let data = req.body;
        let product = await productModel.insertMany(data);
        return res.status(200).send({status:true,msg:"product added",product})
        
    } catch (error) {
        return res.status(500).send({status:false,msg:error.message})
    }
}

module.exports = {addNewProduct}