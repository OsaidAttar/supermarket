import slugify from "slugify";
import cloudinary from "../../../Services/cloudinary.js";
import { asyncHandler } from "../../../Services/errorHandling.js";
import stockManagementModel from "../../../../DB/models/stockManagement.model.js";
import employeeModel from "../../../../DB/models/Employees.model.js";

export const createstockManagement =(asyncHandler(async(req,res,next)=>{
    const {name,categoryId,subCategoryId,supplierId,employeeId,distributorsId}=req.body
    if(await stockManagementModel.findOne({name})){
        return next(new Error(`Dublicate stockManagement name `,{cause:409}))
    }   
    const checkCategory=await stockManagementModel.find({_id:subCategoryId,categoryId})
    if (!checkCategory) {
        return next(new Error("invalid category or sub category"), { cause: 400 });
    }
    
    const stockManagement =await stockManagementModel.create({name,distributorsId,employeeId,supplierId,createdBy:req.user._id,updatedBy:req.user._id,categoryId,subCategoryId})
   
    return res.status(201).json({message:"success",stockManagement})
}))
export const updatestockManagement =asyncHandler(async(req,res,next)=>{
    const {stockmanagementId}=req.params
const stockmanagement =await stockManagementModel.findById(stockmanagementId)
if(!stockmanagement){
    return next(new Error(`not found stockmanagement  `,{cause:409}))
}
if(req.body.name){
    if(stockmanagement.name==req.body.name){
        return next(new Error(`old name match new name `,{cause:400}))
    }
    if(await stockManagementModel.findOne({name:req.body.name})){
        return next(new Error(`Dublicate stockmanagement name `,{cause:409}))
    }
    stockmanagement.name=req.body.name
    stockmanagement.slug=slugify(req.body.name)

}



stockmanagement.updatedBy=req.user._id

await stockmanagement.save()

return res.status(201).json({message:"success",stockmanagement})
})
export const deletestockManagement =asyncHandler(async(req,res,next)=>{
    const {stockmanagementId}=req.params
    const stockmanagement = await stockManagementModel.findByIdAndDelete(stockmanagementId)
    if(!stockmanagement){
        return next(new Error(`stockmanagement not found `,{cause:400}))  
    }
    return res.status(200).json({message:"success"})
})
export const getStockManagement =asyncHandler(async(req,res,next)=>{
    const{stockmanagementId}=req.params
    const stockmanagement = await stockManagementModel.findById(stockmanagementId)
    if(!stockmanagement){
        return next(new Error(`employee not found `,{cause:400}))
    }
    return res.status(200).json({message:"success",stockmanagement})
})
export const getStockManagements =asyncHandler(async(req,res,next)=>{
    const stockmanagement = await stockManagementModel.find()
    return res.status(200).json({message:"success",stockmanagement})
})
