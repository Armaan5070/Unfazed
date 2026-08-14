import jwt from "jsonwebtoken"

export const authMiddleware = async (req,res,next)=>{
    try{
        const authHeader = req.headers.authorization
        if(!authHeader){
            return res.status(401).json({message:"Authorization Required"});
        }

        const token = authHeader.split(" ")[1];
        if(!token){
            return res.status(401).json({message:"Authentication token not valid"});
        }
        const decodedUser = jwt.verify(token,process.env.JWT_SECRET_KEY)

        req.user = decodedUser;

        next();

    }catch(err){
        console.log(err);
        return res.status(403).json({message:"Invalid Token or expired"});
    }
}