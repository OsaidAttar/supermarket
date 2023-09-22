import slugify from "slugify";
import distributorsModel from "../../../../DB/models/distributors.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import { asyncHandler } from "../../../Services/errorHandling.js";
import productModel from "../../../../DB/models/Product.model.js";

export const createDistributors =(asyncHandler(async(req,res,next)=>{
    const {stockManagementId}=req.params
    const {distributorsName,phoneNumber,email,productId}=req.body
    const products =await productModel.findById(productId)
 
    if(await distributorsModel.findOne({distributorsName})){
        return next(new Error(`Dublicate distributorsName  `,{cause:409}))
    }

    const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.App_Name}/distributors`})
    const distributors =await distributorsModel.create({distributorsName,phoneNumber,email,slug:slugify(distributorsName),image:{secure_url,public_id},createdBy:req.user._id,updatedBy:req.user._id,stockManagementId:stockManagementId})
    return res.status(201).json({message:"success",distributors})
}))
export const updateDistributors =asyncHandler(async(req,res,next)=>{
    const {distributorsId}=req.params
const distributors=await distributorsModel.findById(distributorsId)
if(!distributors){
    return next(new Error(`not found distributors  `,{cause:409}))
}
if(req.body.distributorsName){
    if(distributors.name==req.body.distributorsName){
        return next(new Error(`old name match new name `,{cause:400}))
    }
    if(await distributorsModel.findOne({distributorsName:req.body.distributorsName})){
        return next(new Error(`Dublicate distributors name `,{cause:409}))
    }
    distributors.distributorsName=req.body.distributorsName
    distributors.slug=slugify(req.body.distributorsName)

}
if(req.file){
    const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.App_Name}/distributors`})
    await cloudinary.uploader.destroy(distributors.image.public_id)
    
    distributors.image={secure_url,public_id} 
}
distributors.updatedBy=req.user._id

if(req.body.phoneNumber){
    if(distributors.phoneNumber==req.body.phoneNumber){
        return next(new Error(`this same number phone `,{cause:400}))
    }
    if(await distributorsModel.findOne({phoneNumber:req.body.phoneNumber})){
        return next(new Error(`Dublicate distributors phone number `,{cause:409}))
    }
    distributors.phoneNumber=req.body.phoneNumber
}

await distributors.save()

return res.status(201).json({message:"success",distributors})
})
export const deleteDistributors =asyncHandler(async(req,res,next)=>{
    const {distributorsId}=req.params
    const distributor=await distributorsModel.findByIdAndDelete(distributorsId)
    if(!distributor){
        return next(new Error(`not found distributor `,{cause:409}))
    }
    return res.status(201).json({message:"success"})

})
export const getAllDistributors =asyncHandler(async(req,res,next)=>{
    const distributor=await distributorsModel.find()
    return res.status(201).json({message:"success",distributor})
})
export const getDistributor =asyncHandler(async(req,res,next)=>{
    const {distributorsId}=req.params
    const distributor=await distributorsModel.findById(distributorsId)
    return res.status(201).json({message:"success",distributor})
})
export const updateStatusDistributor =asyncHandler(async(req,res,next)=>{
    const {distributorsId}=req.params
    let distributor = await distributorsModel.findById(distributorsId)
    let now =new Date()
    
    distributor.time =now.toTimeString()
     let data ='16'
     let time ='08'
     if(distributor.time>= data || distributor.time<time){          
        distributor= await distributorsModel.findByIdAndUpdate(distributorsId,{status:"Not_Active",time:distributor.time },{new:true})
              }
     else{
        distributor= await distributorsModel.findByIdAndUpdate(distributorsId,{status:"Active",time:distributor.time})
     }
     return res.json({message:"Success",distributor})
})
