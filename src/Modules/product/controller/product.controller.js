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

export const updateProduct =asyncHandler(async(req,res,next)=>{
    const {productId}=req.params
    const {name, price, discount, categoryId, subCategoryId}=req.body
    const product=await productModel.findById(productId)
    if(!product){
        return next(new Error(`product not found`, { cause: 400 }));
    }
    if(categoryId && subCategoryId){
        const checkCategory =await subCategoryModel.findById({
            _id:subCategoryId, categoryId })
            if(checkCategory){
                product.categoryId=categoryId
                product.subCategoryId=subCategoryId
            }
            else{
                return next(new Error(`invalid category or sub category`),{cause: 400,});
            }
    }
     if(subCategoryId){
        const checkSubcategory = await subCategoryModel.findById({_id:subCategoryId})
        if(checkSubcategory){
            product.subCategoryId=subCategoryId
        }
        else{
            return next(new Error(`invalid sub category`),{cause: 400,});
        } 
    }
    if(name){
        product.name=name
        product.slug=slugify(name)
    }
    if(req.body.description){
        product.description=req.body.description
    }
    if (req.body.stock) {
        product.stock = req.body.stock;
      }
      if(price && discount){
        product.price=price
        product.discount=discount
        product.finalPrice=price-price*((product.discount||0)/100)
      }
      else if (price){
        product.price=price
        product.finalPrice=product.price-product.price*((discount||0)/100)
      }
      else if (discount){
        product.discount=discount
        product.finalPrice=price-price*((discount||0)/100)
      }
      if(req.files.mainImages){
        const { secure_url, public_id } = await cloudinary.uploader.upload(
            req.files.mainImages[0].path,
            { folder: `${process.env.App_Name}/product` }
          );
          await cloudinary.uploader.destroy(product.mainImages.public_id)
          product.mainImages.public_id=public_id
          product.mainImages.secure_url=secure_url
      }
      if(req.files.subImages.length){
        
        const subImages=[]
       
        for(const file of product.subImages ){
          
            await cloudinary.uploader.destroy(file.public_id) 
          
        }
        for(const file of req.files.subImages ){
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path,{ folder: `${process.env.App_Name}/product/subImages` });
              subImages.push({ secure_url, public_id });
              
        }
 
        
      
        product.subImages=subImages
        //destroy subimages
      }
      product.updatedBy=req.user._id
      const newProduct= await product.save()
      if(!newProduct){
        return next(new Error(`fail to update product `, { cause: 404 }));
      }
      return res.json({ message: "success", product });
})
export const softDelete=asyncHandler(async(req,res,next)=>{
let {productId}=req.params
const product =await productModel.findByIdAndUpdate({
    _id: productId,deleted:false},{deleted:true},{new:true})
    if (!product) {
        return next(new Error(` product not found`, { cause: 404 }));
      }
      return res.json({ message: "success", product });
})
export const forceDelete=asyncHandler(async(req,res,next)=>{
    let {productId}=req.params
    const product =await productModel.findByIdAndDelete({
        _id: productId,delete:true})
        if (!product) {
            return next(new Error(` product not found`, { cause: 404 }));
          }
          return res.json({ message: "success", product });
    })
    export const restore = asyncHandler(async (req, res, next) =>{
        const {productId}=req.params
        const product=await productModel.findByIdAndUpdate({
            _id:productId,deleted:true},{deleted:false},{new:true})
            if (!product) {
                return next(new Error(` product not found`, { cause: 404 }));
              }
              return res.json({ message: "success", product });
    })
    export const getSoftDeleteProducts = asyncHandler(async (req, res, next) => {
        const product=await productModel.find({deleted:true})
        return res.json({ message: "success", product });
    })
    export const getProduct = asyncHandler(async (req, res, next) =>{
        const { productId } = req.params;
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new Error(`product not found `, { cause: 409 }));
  }
  return res.status(201).json({ message: "success", product });
    })
    export const getProducts = asyncHandler(async (req, res, next) => {
        let {page,size}=req.query
if(!page ||page<0){
    page=1
}
if(!size ||size<0){
    size=3
}
const skip =(page-1)*size
const excQueryParams=['page','size','sort','search']
const filterQuery={...req.query}
excQueryParams.map(params=>{
    delete filterQuery[params]
})
const query =JSON.parse(JSON.stringify(filterQuery).replace(/(gt|gte|lt|lte|in|nin|eq|neq)/g,match=>`$${match}`))
const mongoQuery =productModel.find(query).limit(size).skip(skip).sort(req.query.sort?.replaceAll(',',' '))
if(req.query.search){
    const products=await mongoQuery.find({
        $or:[
            {name:{$regex:req.query.search,$options:'i'},},
            {description:{regex:req.query.search,$options:'i'}}
        ]
    })
    req.body.products=products
   
}
else{
    const products=await mongoQuery
    req.body.products=products
}
const products=req.body.products
if (!products) {
    return next(new Error(`product not found `, { cause: 409 }));
  }

  return res.status(201).json({ message: "success", products });

    })

