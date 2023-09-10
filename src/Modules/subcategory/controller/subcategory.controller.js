import slugify from "slugify";
import subCategoryModel from "../../../../DB/models/SubCategory.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import { asyncHandler } from "../../../Services/errorHandling.js";
import productModel from "../../../../DB/models/Product.model.js";

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
export const updateSubCategory =asyncHandler(async(req,res,next)=>{
    const {categoryId,subcategoryId}=req.params
    const subcategory =await subCategoryModel.findById({_id:subcategoryId,categoryId})
    if(!subcategory){
        return next(new Error(`invalid sub category id ${req.params.categoryId}`,{cause:404}))
    }
    if(req.body.name){
        if(subcategory.name==req.body.name){
            return next(new Error(`old name match new name `,{cause:400}))
        }
        if(await subCategoryModel.findOne({name:req.body.name})){
            return next(new Error(`Dublicate sub category name `,{cause:409}))
        }
        subcategory.name=req.body.name
        subcategory.slug=slugify(req.body.name)
    }
    if(req.file){
        const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.App_Name}/sub category`})
    await cloudinary.uploader.destroy(subcategory.image.public_id)
    subcategory.image={secure_url,public_id}
    }
    req.body.updatedBy=req.user._id
await subcategory.save()   
return res.status(201).json({message:"success",subcategory}) 
})
export const deleteSubCategory = asyncHandler(async (req, res, next) => {
const {subcategoryId}=req.params
const subcategory =await subCategoryModel.findByIdAndDelete(subcategoryId)
if(!subcategory){
    return next(new Error(`invalid sub category id ${req.params.subcategoryId}`,{cause:404}))
}
const product = await productModel.deleteOne({subcategoryId}) 
return res.json({ message: "success", subcategory });
})
export const getSubcategories = asyncHandler(async (req, res, next) => {
    const subcategory =await subCategoryModel.find().populate({
        path:'categoryId',
select:'_id name image'
    })
    return res.status(201).json({message:"success",subcategory})
})
export const getSubcategory = asyncHandler(async (req, res, next) => {
    const {subcategoryId}=req.params
    const subcategory =await subCategoryModel.findById(subcategoryId)
       
    return res.status(201).json({message:"success",subcategory})
})



