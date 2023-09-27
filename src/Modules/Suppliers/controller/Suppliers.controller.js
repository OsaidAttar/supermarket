import slugify from "slugify";
import cloudinary from "../../../Services/cloudinary.js";
import { asyncHandler } from "../../../Services/errorHandling.js";
import supplierModel from "../../../../DB/models/Suppliers.model.js";
import productModel from "../../../../DB/models/Product.model.js";
import { response } from "express";

export const createSuppliers =(asyncHandler(async(req,res,next)=>{
    
    const {supplierName,email ,phone,products}=req.body
    if(await supplierModel.findOne({supplierName})){
        return next(new Error(`Dublicate supplier name `,{cause:409}))
    }
    
        const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.App_Name}/supplier`})

    const supplier =await supplierModel.create({supplierName,email,phone,slug:slugify(supplierName),image:{secure_url,public_id},createdBy:req.user._id,updatedBy:req.user._id})
    
 
    return res.status(201).json({message:"success",supplier})
}))





export const updateSuppliers =asyncHandler(async(req,res,next)=>{
    const {suppliersId}=req.params
const suppliers =await supplierModel.findById(suppliersId)
if(!suppliers){
    return next(new Error(`not found suppliers  `,{cause:409}))
}
if(req.body.supplierName){
    if(suppliers.supplierName==req.body.supplierName){
        return next(new Error(`old name match new name `,{cause:400}))
    }
    if(await supplierModel.findOne({supplierName:req.body.supplierName})){
        return next(new Error(`Dublicate suppliers name `,{cause:409}))
    }
    suppliers.supplierName=req.body.supplierName
    suppliers.slug=slugify(req.body.supplierName)

}
if(req.body.email){
    if(suppliers.email==req.body.email){
        return next(new Error(`old email match new email `,{cause:400}))
    }
    if(await supplierModel.findOne({email:req.body.email})){
        return next(new Error(`Dublicate suppliers email `,{cause:409}))
    }
    suppliers.email=req.body.email
   

}
if(req.file){
    const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.App_Name}/supplier`})
    await cloudinary.uploader.destroy(suppliers.image.public_id)
    suppliers.image={secure_url,public_id} 
}
suppliers.updatedBy=req.user._id

if(req.body.phone){
    if(suppliers.phone==req.body.phone){
        return next(new Error(`this same number phone `,{cause:400}))
    }
    if(await supplierModel.findOne({phone:req.body.phone})){
        return next(new Error(`Dublicate suppliers phone number `,{cause:409}))
    }
    suppliers.phone=req.body.phone
}
suppliers.products=req.body.products

await suppliers.save()

return res.status(201).json({message:"success",suppliers})
})
export const getSuppliers =asyncHandler(async(req,res,next)=>{
    const suppliers = await supplierModel.find()
    return res.status(200).json({message:"success",suppliers})
})
export const getSupplier =asyncHandler(async(req,res,next)=>{
    const{suppliersId}=req.params
    const suppliers= await supplierModel.findById(suppliersId)
    if(!suppliers){
        return next(new Error(`suppliers not found `,{cause:400}))
    }
    return res.status(200).json({message:"success",suppliers})
})
export const deleteSupplier =asyncHandler(async(req,res,next)=>{
    const {suppliersId}=req.params
    const suppliers = await supplierModel.findByIdAndDelete(suppliersId)
    if(!suppliers){
        return next(new Error(`suppliers not found `,{cause:400}))  
    }
    return res.status(200).json({message:"success"})
})
export const updateStatus =asyncHandler(async(req,res,next)=>{
    const {suppliersId}=req.params
    let suppliers = await supplierModel.findById(suppliersId)
    let now =new Date()
    
    suppliers.time =now.toTimeString()
    
    
     let data ='16'
     let time ='08'
  
            if(suppliers.time>= data || suppliers.time<time){
                
                 
                suppliers= await supplierModel.findByIdAndUpdate(suppliersId,{status:"Not_Active",time:suppliers.time },{new:true})
                   
               }
            
         
    
     else{
        suppliers= await supplierModel.findByIdAndUpdate(suppliersId,{status:"Active",time:suppliers.time})
     }
     return res.json({message:"Success",suppliers})
    }
    )
    export const addProduct =asyncHandler(async(req,res,next)=>{
const {suppliersId}=req.params
const {products}=req.body

const supplier=await supplierModel.findById(suppliersId)
const finalProductList=[]
const productIds=[]
let subTotal=0


for (const product of products){
    const checkProduct=await productModel.findOne({
        _id:product.productId,
        stock:{$gte:product.qty},
        deleted:false
    })
    if(!checkProduct){
        return next(new Error(`invalid product`,{cause:404}))
        
    }
    product.name=checkProduct.name
    product.unitPrice=checkProduct.finalPrice
    product.finalPrice=product.qty*checkProduct.finalPrice
    subTotal+=product.finalPrice
    productIds.push(product.productId)
    finalProductList.push(product)
    subTotal=subTotal+product.finalPrice

    for (let product of products) {
        
        
        
        let matchProduct=false
        for(let i=0;i<supplier.products.length;i++){
            if(supplier.products[i].productId.toString()==product.productId){
                
                const checkProduct=await productModel.findOne({
                    _id:product.productId,
                    stock:{$gte:product.qty},
                    deleted:false
                })
                if(!checkProduct){
                    return next(new Error(`invalid product`,{cause:404}))
                    
                }
                let qty= supplier.products[i].qty
                let finalPrice =supplier.products[i].finalPrice
                finalPrice=qty*checkProduct.finalPrice
                
                
                matchProduct=true
                
                let subTotal=0
                for (let product of supplier.products){
          console.log(product);
          
          product.finalPrice=finalPrice
          
          
          
          supplier.subTotal=subTotal+product.finalPrice
          supplier.finalPrice=supplier.subTotal-(supplier.subTotal*(req.body.coupon?.amount||0)/100)
         
          await supplier.save()
        }
    }}
}

}


await supplier.save()
return res.status(200).json({message:"Success",supplier})

    })
    