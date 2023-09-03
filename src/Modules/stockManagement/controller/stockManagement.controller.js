import slugify from "slugify";
import cloudinary from "../../../Services/cloudinary.js";
import { asyncHandler } from "../../../Services/errorHandling.js";
import stockManagementModel from "../../../../DB/models/stockManagement.model.js";

export const createstockManagement =(asyncHandler(async(req,res,next)=>{
    const {name,categoryId,subCategoryId,supplierId,employeeId}=req.body
    if(await stockManagementModel.findOne({name})){
        return next(new Error(`Dublicate stockManagement name `,{cause:409}))
    }   
    const checkCategory=await stockManagementModel.find({_id:subCategoryId,categoryId})
    if (!checkCategory) {
        return next(new Error("invalid category or sub category"), { cause: 400 });
    }
    const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.App_Name}/stockManagement`})
    const stockManagement =await stockManagementModel.create({name,slug:slugify(name),employeeId,supplierId,image:{secure_url,public_id},createdBy:req.user._id,updatedBy:req.user._id,categoryId,subCategoryId})
    return res.status(201).json({message:"success",stockManagement})
}))