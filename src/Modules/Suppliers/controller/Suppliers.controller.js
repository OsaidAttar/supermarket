import slugify from "slugify";
import cloudinary from "../../../Services/cloudinary.js";
import { asyncHandler } from "../../../Services/errorHandling.js";
import supplierModel from "../../../../DB/models/Suppliers.model.js";

export const createSuppliers =(asyncHandler(async(req,res,next)=>{
    const {stockManagementId}=req.params
    const {supplierName,email ,phone,products}=req.body
    if(await supplierModel.findOne({supplierName})){
        return next(new Error(`Dublicate supplier name `,{cause:409}))
    }
    if(req.file){
        const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.App_Name}/supplier`})

    }
   
    const supplier =await supplierModel.create({supplierName,email,phone,slug:slugify(supplierName),image:{secure_url,public_id},createdBy:req.user._id,updatedBy:req.user._id,stockManagementId})
    return res.status(201).json({message:"success",supplier})
}))