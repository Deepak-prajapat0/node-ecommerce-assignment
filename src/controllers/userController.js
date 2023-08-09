const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const {signupValidation,loginValidation} = require("../validations/userValidation");
const otpSender = require("../utils/nodemailer");
const crypto =  require("crypto");
const {jwtToken,refreshToken,verifyRefreshToken} = require("../utils/token");



const registerUser =async(req,res)=>{
    try {
        let {name,email,password} = req.body;
        const inputError = signupValidation.validate({name,email,password});
        if(inputError.error){
            return res.status(400).send({msg:inputError.error.details[0].message});
        }
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(409).send({status:false,msg:"User already exist"});
        }
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password,salt);
        // createing user
        const user = await userModel.create({name,email,password});

        // generating token and refreshToken
        const token = jwtToken(user._id);
        const refreshJwtToken =  refreshToken(user._id)
        user.tokens = [{token,validUpto:new Date(Date.now() + (5 * 60 * 1000))}];
        user.save();
        res.header('x-api-key',token)
        return res.status(201).send({status:true,msg:"Account created successfully",user,refreshJwtToken})

    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

const loginUser = async(req,res)=>{
    try {
        let {email,password}= req.body;
        const inputError = loginValidation.validate({email,password});
        if(inputError.error){
            return res.status(400).send({msg:inputError.error.details[0].message});
        }
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).send({status:false,msg:"User not found with this email"})
        }
        let decyptPass = await bcrypt.compare(password,user.password)
        if(!decyptPass){
            return res.status(401).send({status:false,msg:"Invalid password"})
        }
        // generating token and refreshToken
        const token =  jwtToken(user._id)
        const refreshJwtToken =  refreshToken(user._id)
        res.header("x-api-key",token)

        // getting all tokens of user
        let oldTokens = user.tokens || []
        if(oldTokens.length){
            oldTokens= oldTokens.filter(t=> t.validUpto > new Date())
        }
        
        await userModel.findByIdAndUpdate(user._id,{tokens:[...oldTokens,{token,validUpto:new Date(Date.now() + (5 * 60 * 1000))}]})        
        return res.status(200).send({status:true,msg:"Login successfully",token,refreshJwtToken})
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
        // sending token on email
        let emailSendWithToken =  await otpSender(emailToken,user.name,email)
        if(!emailSendWithToken){
            return res.status(400).send({status:false,msg:"something wrong please try later"})
        }
        user.emailToken = emailToken
        user.emailTokenExp = new Date(Date.now() + (5 * 60 * 1000))
        user.save();
        return res
          .status(200)
          .send({
            status: true,
            msg: `If an account exists for ${email} , you will get an link to resetting your password. `,
          });
            
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
        if(!userEmailToken){
                return res.status(401).send({status:false,msg:"link expired,create a new link"})
        }
        // check if link is expired or not
        if(userEmailToken.emailTokenExp < new Date()){
            return res.status(401).send({status:false,msg:"link is expired ,Please create a new one"})
        }
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
        const userId = req.user._id;
        const token = req.headers['x-api-key'];
        // retrieving previous generated tokens
        const tokens = req.user.tokens;
        const newTokens = tokens.filter(t =>t.token !==token) 
        await userModel.findByIdAndUpdate(userId,{tokens:newTokens},{new:true})    
        return res.status(204).send({status:true,msg:"Logout successfully"})    
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

const generateNewToken =async(req,res)=>{
    try {
        let refreshTokenInBody = req.body.refreshToken;
        const verifiedToken = verifyRefreshToken(refreshTokenInBody);
        if(!verifiedToken){
            return res.status(401).send({status:false,msg:"invalid token please login again"})
        }
        let newToken = jwtToken(verifiedToken._id);
        let newRefreshToken = refreshToken(verifiedToken._id)
        const user = await userModel.findById(verifiedToken._id);
        user.tokens = [{newToken,validUpto:new Date(Date.now() + (5 * 60 * 1000))}];
        await user.save();
        return res.status(200).send({status:true,msg:"new token generated",token:newToken,refreshToken:newRefreshToken})
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}
module.exports ={registerUser,loginUser,forgetPassword,updatePassword,logout,generateNewToken}
