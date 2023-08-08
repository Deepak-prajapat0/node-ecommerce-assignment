const jwt = require("jsonwebtoken");

const jwtToken = (id)=>{
    return jwt.sign({_id:id},process.env.JWT_PRIVATE_KEY,{expiresIn:"30m"}) 
}

const refreshToken =(id)=>{
 return jwt.sign({_id:id},process.env.JWT_PRIVATE_KEY,{expiresIn:"60m"})
} 

const verifyRefreshToken =(token)=>{
    try {
        if(!token){
            return false
        }
        let decodedRefreshToken= jwt.verify(token,process.env.JWT_PRIVATE_KEY)        
        return decodedRefreshToken
    } catch (error) {
        return false
    }
} 

module.exports ={jwtToken,refreshToken,verifyRefreshToken}