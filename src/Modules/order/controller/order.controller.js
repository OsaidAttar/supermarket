import moment from "moment";
import couponModel from "../../../../DB/models/Coupon.model.js";
import { asyncHandler } from "../../../Services/errorHandling.js";
import productModel from "../../../../DB/models/Product.model.js";
import orderModel from "../../../../DB/models/Order.model.js";
import cartModel from "../../../../DB/models/Cart.model.js";
import createInvoice from "../../../Services/pdf.js";
import { sendEmail } from "../../../Services/sendEmail.js";


export const createOrder =asyncHandler(async (req,res,next)=>{
    const {products,address,phoneNumber,couponName,paymentType}=req.body
    if(couponName){
        const coupon =await couponModel.findOne({name:couponName.toLowerCase()})
        if(!coupon){
            return next(new Error(`invalid coupon ${couponName}`,{cause:404}))
        }
        let now =moment()
        let parsed=moment(coupon.expireDate,'DD/MM/YYYY')
        let diff=now.diff(parsed,'days')
        if(diff >=0){
            return next(new Error(` coupon expired ${couponName}`,{cause:404}))
        }
        if(coupon.usedBy.includes(req.user._id)){
            return next(new Error(` coupon already used by  ${req.user._id}`,{cause:404}))
        }
        req.body.coupon = coupon
        
    }
    const finalProductList=[]
    const productIds=[]
    let subTotal=0
    for(const product of products){
        const checkProduct=await productModel.findOne({
            _id:product.productId,
            stock:{$gte:product.qty}
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
    }
    const order =await orderModel.create({
        userId:req.user._id,
        address,
        phoneNumber,
        products:finalProductList,
        subTotal,
        couponId:req.body.coupon?._id,
        paymentType,
        finalPrice:subTotal- (subTotal*(req.body.coupon?.amount||0)/100),
        status:(paymentType=='card')?'approved':'pending'
    })
    for(const product of products){
        await productModel.updateOne({_id:product.productId},{$inc:{stock:-product.qty}})
    }
    if(req.body.coupon){
        await couponModel.updateOne({ _id:req.body.coupon._id},{$addToSet:{usedBy:req.user._id}})}
        await cartModel.updateOne({userId:req.user._id},{
$pull:{
    products:{
        productId:{$in:productIds}
    }
}
        }
        )
        const invoice = {
            shipping: {
                name: req.user.userName,
                address,
                city: "Qalqilya",
                
            },
            items:order.products,
            subTotal:order.subTotal,
            total:order.finalPrice,
            invoice_nr: order._id
        };
        
        createInvoice(invoice, "invoice.pdf");  
            
        // await sendEmail(req.user.email,'infinity light-invoice','welcome',{
           
        //     path:'invoice.pdf',
        //     contentType:'application/pdf'
        // })    
       
        return res.status(200).json({message:"success",order})
    })
