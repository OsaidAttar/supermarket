import couponModel from "../../../../DB/models/Coupon.model.js";
import { asyncHandler } from "../../../Services/errorHandling.js";

export const createCoupon =asyncHandler(async(req,res,next)=>{
    const {name}=req.body
    let date = new Date(req.body.expireDate)

let now =new Date()
if(now.getTime()>=date.getTime()){
    return next(new Error(`invalid date `,{cause:400}))
}
date=date.toLocaleDateString()
req.body.expireDate=date
if(await couponModel.findOne({name})){
    return next(new Error(`Dublicate coupon name ${name}`,{cause:409}))
}
req.body.createdBy=req.user._id
req.body.updatedBy=req.user._id
const coupon=await couponModel.create(req.body)
return res.status(201).json({message:"success",coupon})
})