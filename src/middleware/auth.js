const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel")

const auth = async(req,res,next)=>{
    try {
        let token = req.headers["x-api-key"] || req.headers['X-API-KEY'];
        if (!token){
            return res.status(401).send({ status: false, msg: "Token is not present" })
        }
     jwt.verify(token, process.env.JWT_PRIVATE_KEY, async(err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: 'Unauthorized - Token has expired' });
                } else {
                    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
                }
            }
            let user = await userModel.findById(decoded._id);
            if (!user) {
                return res.status(401).send({ status: false, msg: "unauthorized Access" })
            }
            req.user = user;
            next()
        });
       

    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

module.exports = auth