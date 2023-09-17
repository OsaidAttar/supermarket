import slugify from "slugify";
import cloudinary from "../../../Services/cloudinary.js";
import { asyncHandler } from "../../../Services/errorHandling.js";
import stockManagementModel from "../../../../DB/models/stockManagement.model.js";
import employeeModel from "../../../../DB/models/Employees.model.js";

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
export const createEmployeestockManagement =(asyncHandler(async(req,res,next)=>{
    const {stockManagementId}=req.params
    const {employeeName,email ,phone,salary}=req.body
    if(await employeeModel.findOne({employeeName})){
        return next(new Error(`Dublicate employee name `,{cause:409}))
    }
   
    const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.App_Name}/Employees`})
    const Employee =await employeeModel.create({employeeName,slug:slugify(employeeName),email,phone,salary,stockManagementId,image:{secure_url,public_id},createdBy:req.user._id,updatedBy:req.user._id})
    return res.status(201).json({message:"success",Employee})
}))