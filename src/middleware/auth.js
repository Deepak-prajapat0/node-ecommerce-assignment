const jwt = require("jsonwebtoken");

const auth = async(req,res,next)=>{
    try {
        let token  = req.headers["x-api-key"];
        if (!token){
            return res.status(401).send({ status: false, msg: "Token is not present" })
        }
        let decodedToken = jwt.verify(token,process.env.JWT_PRIVATE_KEY);
        req.userId = decodedToken._id;
        next()

    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

module.exports = auth