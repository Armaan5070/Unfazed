import api from "../../../frontend/src/api/axiosInstance";
import Therapist from "../models/Therapist";

export const getProfile = async (req,res)=>{
    try {
        const {userId} = req.user.userId;
        const userData = await Therapist.findOne({
            _id:userId
        })

        return res.status(202).json(userData);

        
    } catch (error) {
        return res.status(404).json({message:"Not found"})
    }

    
}

export const updateProfile = async (req,res)=>{
    try {
        const {userId} = req.user.userId;
        const data = req.body;
        data.slug = data.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
       
        const existingSlug = await Therapist.findOne({
            slug:data.slug,
            _id: {$ne: userId}
        })
        if(existingSlug)return res.status(400).json({message:"Slug is already taken"});

        const updatedUser = await Therapist.updateOne(
            {_id:userId},
            {
                $set : {
                    name:data.name,
                    slug:data.slug,
                    bio:data.bio,
                    specializations:data.specializations,
                    languages:data.languages
                }
            }

        )

        if(updatedUser)return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(400).json({message:"Cannot update profile"});
    }
}