import slugify from "slugify";
import distributorsModel from "../../../../DB/models/distributors.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import { asyncHandler } from "../../../Services/errorHandling.js";

export const createDistributors =(asyncHandler(async(req,res,next)=>{
    const {stockManagementId}=req.params
    const {distributorsName,email ,phone}=req.body
    if(await distributorsModel.findOne({distributorsName})){
        return next(new Error(`Dublicate category name `,{cause:409}))
    }

    const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.App_Name}/distributors`})
    const distributors =await distributorsModel.create({distributorsName,email,phone,slug:slugify(distributorsName),image:{secure_url,public_id},createdBy:req.user._id,updatedBy:req.user._id,stockManagementId})
    return res.status(201).json({message:"success",distributors})
}))