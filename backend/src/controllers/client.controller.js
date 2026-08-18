import Therapist from "../models/Therapist.js";

export const userSlug = async (req,res)=>{
    try {
        
        const {slug} = req.params;
    
    
        const user = await Therapist.findOne({
            slug:slug
        }).select("-password_hash -createdAt -updatedAt")

       if (!user) {
      return res.status(404).json({ message: "Profile not found in database" });
    }
       
        return res.status(200).json({message:"Profile fetched successfull",
            data:user
        })
    } catch (error) {
        return res.status(404).json({message:"Profile Not Found"})
    }

    
}