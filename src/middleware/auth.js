const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel")

const auth = async(req,res,next)=>{
    try {
        let token  = req.headers["x-api-key"];
        if (!token){
            return res.status(401).send({ status: false, msg: "Token is not present" })
        }
        let decodedToken = jwt.verify(token,process.env.JWT_PRIVATE_KEY);
        let user = await userModel.findById(decodedToken._id);
        if(!user){
            return res.status(401).send({ status: false, msg: "unauthorized Access" })
        }
        const invalidToken = user.tokens.filter(x=>x.token === token)
        if(invalidToken.length === 0){
            return res.status(403).send({status:false,msg:"invalid Access"})
        }
        req.user = user;
        next()

    } catch (error) {
        // if(TokenExpiredError,JsonWebTokenError)
        return res.status(500).send({error:error.message})
    }
}

module.exports = auth