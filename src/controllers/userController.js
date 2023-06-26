const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {signupValidation,loginValidation} = require("../validations/userValidation");
const otpSender = require("../utils/nodemailer");
const crypto =  require("node:crypto")


const registerUser =async(req,res)=>{
    try {
        let {name,email,password} = req.body;
        const inputError = signupValidation.validate({name,email,password});
        if(inputError.error){
            return res.status(400).send({error:inputError.error.details[0].message});
        }
        const existingUser = await userModel.findOne({email:email});
        if(existingUser){
            return res.status(409).send({status:false,msg:"User already exist"});
        }
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password,salt);
        const user = await userModel.create({name,email,password});
        const token = jwt.sign({id:user._id},process.env.JWT_PRIVATE_KEY,{expiresIn:"5m"})
        user.token = token;
        user.save();
        res.header('x-api-key',token)
        return res.status(201).send({status:true,msg:"Account created successfully",user})

    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

const loginUser = async(req,res)=>{
    try {
        let {email,password}= req.body;
        const inputError = loginValidation.validate({email,password});
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
        const token = jwt.sign({_id:user._id},process.env.JWT_PRIVATE_KEY,{expiresIn:"15m"})
        res.header("x-api-key",token)
        user.token = token;
        user.save();
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
        const emailToken = crypto.randomBytes(15).toString('hex');
        let emailSendWithToken =  otpSender(emailToken,user.name,email)
        if(!emailSendWithToken){
            return res.status(400).send({status:false,msg:"something wrong please try later"})
        }
        user.emailToken = emailToken
        user.emailTokenExp = new Date(Date.now() + (5 * 60 * 1000))
        user.save();
        return res.status(200).send({status:true,msg:"Otp has been sent to your email"})
            
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

const updatePassword = async(req,res)=>{
    try {
        let emailToken = req.params.emailToken;
        let {password,confirmPassword} = req.body;
        if(!emailToken){
            return res.status(400).send({status:false,msg:"Enter token to update password"})
        }
        //token validation
        let userEmailToken = await userModel.findOne({emailToken:emailToken});
        // let decodedToken = jwt.verify(emailToken,process.env.JWT_PRIVATE_KEY)
        if(!userEmailToken){
                return res.status(401).send({status:false,msg:"invalid link"})
            }
        if(userEmailToken.emailTokenExp < new Date()){
            return res.status(401).send({status:false,msg:"link is expired ,Please create a new one"})
        }
        // let user = await userModel.findOne({_id:userId,email:userEmailToken.email});
        // if(!user){
        //     return res.status(400).send({status:false,msg:"User not found"})
        // }

        if(!password){
            return res.status(400).send({status:false,msg:"Password should have a minimum length of 6"})
        }
        if(password !== confirmPassword){
            return res.status(400).send({status:false,msg:"password and confirmPassword are not matched"})
        }

        // hashing password
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password,salt)

        // updating password and reseting the token
        await userModel.findOneAndUpdate({_id:userEmailToken._id},{$set:{password:password,emailToken:"",emailTokenExp:0}},{new:true})
        return res.status(200).send({status:true,msg:"Your password updated Successfully"})
            
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

const logout = async(req,res)=>{
    try {
        // res.header('x-api-key','')
       return res.send({msg:"logut"})

        
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}
module.exports ={registerUser,loginUser,forgetPassword,updatePassword,logout}