const jwt = require("jsonwebtoken");

const jwtToken = (id)=>{
    return jwt.sign({_id:id},process.env.JWT_PRIVATE_KEY,{expiresIn:"15m"}) 
}

const refreshToken =(id)=>{
 return jwt.sign({_id:id},process.env.JWT_REFRESH_KEY,{expiresIn:"30m"})
} 

const verifyRefreshToken =(token)=>{
    try {
        if(!token){
            return false
        }
        let decodedRefreshToken= jwt.verify(token,process.env.JWT_REFRESH_KEY)        
        return decodedRefreshToken
    } catch (error) {
        return false
    }
} 

module.exports ={jwtToken,refreshToken,verifyRefreshToken}