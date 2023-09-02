import slugify from "slugify";
import subCategoryModel from "../../../../DB/models/SubCategory.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import { asyncHandler } from "../../../Services/errorHandling.js";

export const createSubCategory =asyncHandler(async(req,res,next)=>{
    const {categoryId}=req.params
    const {name}=req.body
    if(await subCategoryModel.findOne({name})){
        return next(new Error(`Dublicate sub category name ${name}`,{cause:409}))
    }
    const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.App_Name}/sub category`})
const subcategory =await subCategoryModel.create({name,slug:slugify(name),image:{secure_url,public_id},categoryId,createdBy:req.user._id,updatedBy:req.user._id})
return res.status(200).json({message:'success',subcategory})
})