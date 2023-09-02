import cartModel from "../../../../DB/models/Cart.model.js";
import productModel from "../../../../DB/models/Product.model.js";
import { asyncHandler } from "../../../Services/errorHandling.js";

export const addProductToCart=(asyncHandler(async(req,res,next)=>{
    const {productId,qty}=req.body
    const product =await productModel.findById(productId)
    if(!product){
        return next(new Error(`not found product`,{cause:409}))
    }
    if(product.stock<qty){
        return next(new Error(`invalid product quantity`,{cause:409}))
    }
    const cart=await cartModel.findOne({userId:req.user._id})
    if(!cart){
        const newCart =await cartModel.create({userId:req.user._id,products:[{productId,qty}]
        })
        return res.status(201).json({message:"success",newCart})
    }
    let matchProduct=false
    for(let i=0;i<cart.products.length;i++){
        if(cart.products[i].productId.toString()==productId){
            cart.products[i].qty=qty
            matchProduct=true
            break;
        }
        if(!matchProduct){
            cart.products.push({productId,qty})
        }
        await cart.save()
return res.status(200).json({message:"success"})
    }
}))