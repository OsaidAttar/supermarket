import slugify from "slugify";
import cloudinary from "../../../Services/cloudinary.js";
import { asyncHandler } from "../../../Services/errorHandling.js";
import employeeModel from "../../../../DB/models/Employees.model.js";

export const createEmployee =(asyncHandler(async(req,res,next)=>{
    const {stockManagementId}=req.params
    const {employeeName,email ,phone}=req.body
    if(await employeeModel.findOne({employeeName})){
        return next(new Error(`Dublicate employee name `,{cause:409}))
    }
   
    const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.App_Name}/Employees`})
    const Employee =await employeeModel.create({employeeName,slug:slugify(employeeName),email,phone,stockManagementId,image:{secure_url,public_id},createdBy:req.user._id,updatedBy:req.user._id})
    return res.status(201).json({message:"success",Employee})
}))