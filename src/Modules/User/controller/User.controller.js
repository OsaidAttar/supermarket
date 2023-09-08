
import userModel from "../../../../DB/models/User.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import { asyncHandler } from "../../../Services/errorHandling.js";
import { compare,hash } from "../../../Services/hashAndCompare.js";

export const userProfile=asyncHandler(async(req,res,next)=>{
    const {userId}=req.params
   
   
   if(!req.file){
    return next(new Error("please provide a file"));
   }
   const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.App_Name}/user`})
 const user =await userModel.findByIdAndUpdate(userId,{image:{secure_url,public_id}})
 return res.status(201).json({message:"success",user})
})
export const updateUserProfile=asyncHandler(async(req,res,next)=>{
    const {userId}=req.params
    const {userName,email}=req.body
    const user =await userModel.findById(userId)
   const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.App_Name}/user`})
  
   await cloudinary.uploader.destroy(user.image.public_id)
 const newUser =await userModel.findByIdAndUpdate(userId,{userName,email,image:{secure_url,public_id}},{new:true})
 return res.status(201).json({message:"success",newUser})
})
export const deleteUserProfile=asyncHandler(async(req,res,next)=>{
const {userId}=req.params
const user =await userModel.findByIdAndDelete({_id:userId})
if (!user) {
    return next(new Error(` user not found`, { cause: 404 }));
  }
  return res.json({ message: "success", user });
})
export const updatePassword=asyncHandler(async(req,res,next)=>{
    const {oldPassword,newPassword}=req.body
    const user =await userModel.findById(req.user._id)
    const match=compare(oldPassword,user.password)
   
    if(!match){
        return next(new Error("invalid password "));
    }
    const hashPassword=hash(newPassword)
    await userModel.findByIdAndUpdate(req.user._id,{password:hashPassword})
    return res.json({message:"success"})
})
export const shareProfile=asyncHandler(async(req,res,next)=>{
    const user = await userModel.findById(req.params.id).select('userName email ');

    if(!user){
        return next(new Error("invalid profile id"));
    }else{

        return res.json({message:'success',user});
    }
})

            
