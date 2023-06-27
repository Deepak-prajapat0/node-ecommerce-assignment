const jwt = require("jsonwebtoken");

const jwtToken = (id)=>{
    return jwt.sign({_id:id},process.env.JWT_PRIVATE_KEY,{expiresIn:"5m"}) 
}

const refreshToken =(id)=>{
 return jwt.sign({_id:id},process.env.JWT_REFRESH_KEY,{expiresIn:"30m"})
} 

const verifyRefreshToken =(token)=>{
    try {
        if(!token){
            return res.status(400).send({status:false,msg:"Please provide refresh Token in body"})
        }
        let decodedRefreshToken= jwt.verify(token,process.env.JWT_REFRESH_KEY)        
        return decodedRefreshToken
    } catch (error) {
        return res.status(400).send({status:false,error:error.message})
    }
} 

module.exports ={jwtToken,refreshToken,verifyRefreshToken}