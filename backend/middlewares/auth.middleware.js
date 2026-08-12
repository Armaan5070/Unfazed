import jwt from "jsonwebtoken"

export const authMiddleware = async (req,res)=>{
    try{
        const authHeader = body.headers.authorization
        if(!authHeader){
            return res.status(401).json({message:"Authorization Required"});
        }

        const token = authHeader.split(" ")[1];
        if(!token){
            res.status(401).json({message:"Authentication token not valid"});
        }
        const decodedUser = jwt.decode(token,process.env.JWT_SECRET_KEY)

        req.user = decodedUser;

        next();

    }catch(err){
        console.log(err);
    }
}