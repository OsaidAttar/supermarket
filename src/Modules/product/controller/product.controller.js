import slugify from "slugify";
import subCategoryModel from "../../../../DB/models/SubCategory.model.js";
import { asyncHandler } from "../../../Services/errorHandling.js";
import cloudinary from "../../../Services/cloudinary.js";
import productModel from "../../../../DB/models/Product.model.js";
import { response } from "express";

export const createProduct =asyncHandler(async(req,res,next)=>{
    const { name, price, discount, categoryId, subCategoryId } = req.body;
    const checkCategory=await subCategoryModel.find({_id:subCategoryId,categoryId})
    if (!checkCategory) {
        return next(new Error("invalid category or sub category"), { cause: 400 });
    }
    req.body.sulg=slugify(name)
    req.body.finalPrice=price-price*((discount||0)/100)
    const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.mainImages[0].path, { folder: `${process.env.App_Name}/product`})
        req.body.mainImages={secure_url, public_id}
        if(req.files.subImages){
            req.body.subImages=[]
            for (const file of req.files.subImages){
                const { secure_url, public_id } = await cloudinary.uploader.upload(
                    file.path,{ folder: `${process.env.App_Name}/product/subImages` });
                    req.body.subImages.push({ secure_url, public_id})
                }
            }
            req.body.createdBy=req.user._id
            req.body.updatedBy=req.user._id
            const product= await productModel.create(req.body)
          
        if(!product){
            return next(new Error(`fail to create product `, { cause: 404 }));
        }
        return res.status(201).json({ message: "success", product });
})