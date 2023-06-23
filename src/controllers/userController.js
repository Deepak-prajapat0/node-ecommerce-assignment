const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {validation} = require("../validations/userValidation")


const registerUser =async(req,res)=>{
    try {
        let {email,password} = req.body;
        const inputError = validation.validate({email,password});
        if(inputError.error){
            return res.status(400).send({error:inputError.error.details[0].message});
        }
        const existingUser = await userModel.findOne({email:email});
        if(existingUser){
            return res.status(409).send({status:false,msg:"User already exist"});
        }
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password,salt);
        const user = await userModel.create({email,password});
        const token = jwt.sign({id:user._id},process.env.JWT_PRIVATE_KEY,{expiresIn:"5m"})
        res.header('x-api-key',token)
        return res.status(201).send({status:true,msg:"Account created successfully",user})

    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

const loginUser = async(req,res)=>{
    try {
        let {email,password}= req.body;
        const inputError = validation.validate({email,password});
        if(inputError.error){
            return res.status(400).send({error:inputError.error.details[0].message});
        }
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).send({status:false,msg:"User not found with this email"})
        }
        let decyptPass = await bcrypt.compare(password,user.password)
        if(!decyptPass){
            return res.status(401).send({status:false,msg:"Invalid password"})
        }
        const token = jwt.sign({id:user._id},process.env.JWT_PRIVATE_KEY,{expiresIn:"5m"})
        // console.log(Math.round(new Date().getTime()/1000))
        res.header("x-api-key",token)
        return res.status(200).send({status:true,msg:"Login successfully"})
    } catch (error) {
        return res.status(500).send({error:error.message})
    }

}

const forgetPassword = async(req,res)=>{
    try {
        let email = req.body.email;
        if(!email){
            return res.status(400).send({status:false,msg:"Enter your registerd email"})
        }
        if(email.length<10){
            return res.status(400).send({status:false,msg:"Enter valid email"})
        }
        let user = await userModel.findOne({email:email});
        if(!user){
            return res.status(400).send({status:false,msg:"User not found with this email"})
        }
        // let emailSendOnToken = await
        // if(!emailSendOnToken){
             
        // }
            
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}
module.exports ={registerUser,loginUser}