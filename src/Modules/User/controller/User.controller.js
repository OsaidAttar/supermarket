
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
export const addAdmin=asyncHandler(async(req,res,next)=>{
    const user =await userModel.findById(req.user._id)
    if(!user){
        return next(new Error("in valid login data",{cause:404}));
    }
    if(user.roles=='Admin'){
        return next(new Error("this user already admin",{cause:404}));

    }
    const newUser=await userModel.findByIdAndUpdate(req.user._id,{roles:'Admin'},{new:true}).select('userName email roles')
    
    return res.status(201).json({message:'success',newUser});
})
export const updateAdmin=asyncHandler(async(req,res,next)=>{
    const {adminId}=req.params
    const {roles}=req.body
    const user =await userModel.findById(adminId)
 
    if(!user){
        return next(new Error("in valid login data",{cause:404}));
    }
    user.roles=req.body.roles
    
    const newUser=await userModel.findByIdAndUpdate(req.user._id,{roles:user.roles},{new:true}).select('userName email roles')
    
    return res.status(201).json({message:'success',newUser});
})
export const deleteAdmin=asyncHandler(async(req,res,next)=>{
    const {adminId}=req.params
    if(! await userModel.findOne({roles:"Admin"})){
        return next(new Error(`this user not admin `,{cause:409}))  
    }
    const user =await userModel.findByIdAndDelete({_id:adminId})
    if (!user) {
        return next(new Error(` user not found`, { cause: 404 }));
      }
      
      return res.json({ message: "success", user });
    })
    export const getAllAdmin =asyncHandler(async (req,res,next)=>{
        const admins  =await userModel.findOne({roles:"Admin"})
       if( await userModel.findOne({roles:"Admin"})){
        return res.status(201).json({message:"success",admins})
       }
      
            return next(new Error(` admin not found`, { cause: 404 }));
        
       
        })
        export const getAdmin =asyncHandler(async (req,res,next)=>{
            const {adminId} =req.params
            const admins  =await userModel.findById(adminId)
           if( await userModel.findOne({roles:"Admin"})){
            return res.status(201).json({message:"success",admins})
           }
          
                return next(new Error(` admin not found`, { cause: 404 }));
            
           
            })
            export const updateStatusAdmin =asyncHandler(async (req,res,next)=>{
                const {adminId}=req.params
                const{status}=req.body
                const user =await userModel.findById(adminId)
                if(!user){
                    return next(new Error(` admin not found`, { cause: 404 }));
                }
                if(req.body.status){
                    if(user.status==req.body.status){
                        return next(new Error(`Dublicate user status `,{cause:409}))
                    }
                    if(! await userModel.findOne({roles:"Admin"})){
                        return next(new Error(`this user not admin `,{cause:409}))  
                    }
                    user.status=req.body.status
                }
                await user.save()
                return res.status(201).json({message:"success",user})
            })
            
