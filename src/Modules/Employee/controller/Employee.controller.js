import slugify from "slugify";
import cloudinary from "../../../Services/cloudinary.js";
import { asyncHandler } from "../../../Services/errorHandling.js";
import employeeModel from "../../../../DB/models/Employees.model.js";
import productModel from "../../../../DB/models/Product.model.js";
import distributorsModel from "../../../../DB/models/distributors.model.js";
import couponModel from "../../../../DB/models/Coupon.model.js";
import moment from "moment";
import orderModel from "../../../../DB/models/Order.model.js";
import cartModel from "../../../../DB/models/Cart.model.js";

import createInvoice from "../../../Services/pdf.js";
import { sendEmail } from "../../../Services/sendEmail.js";
import stockManagementModel from "../../../../DB/models/stockManagement.model.js";
import userModel from "../../../../DB/models/User.model.js";
import supplierModel from "../../../../DB/models/Suppliers.model.js";
export const createEmployee =(asyncHandler(async(req,res,next)=>{
    
    const {employeeName,email ,phone,salary,slug,status}=req.body
    if(await employeeModel.findOne({employeeName})){
        return next(new Error(`Dublicate employee name `,{cause:409}))
    }
   
   
    const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.App_Name}/Employees`})
    let Employee =await employeeModel.create({employeeName,slug:slugify(employeeName),email,status,phone,salary,image:{secure_url,public_id},createdBy:req.user._id,updatedBy:req.user._id})
 
    
    return res.status(201).json({message:"success",Employee})
}))

export const updateEmployee =asyncHandler(async(req,res,next)=>{
    const {employeeId}=req.params
const employee =await employeeModel.findById(employeeId)
if(!employee){
    return next(new Error(`not found employee  `,{cause:409}))
}
if(req.body.employeeName){
    if(employee.name==req.body.employeeName){
        return next(new Error(`old name match new name `,{cause:400}))
    }
    if(await employeeModel.findOne({employeeName:req.body.employeeName})){
        return next(new Error(`Dublicate employee name `,{cause:409}))
    }
    employee.employeeName=req.body.employeeName
    employee.slug=slugify(req.body.employeeName)

}
if(req.file){
    const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.App_Name}/employee`})
    await cloudinary.uploader.destroy(employee.image.public_id)
employee.image={secure_url,public_id} 
}
employee.updatedBy=req.user._id

if(req.body.phone){
    if(employee.phone==req.body.phone){
        return next(new Error(`this same number phone `,{cause:400}))
    }
    if(await employeeModel.findOne({phone:req.body.phone})){
        return next(new Error(`Dublicate employee phone number `,{cause:409}))
    }
    employee.phone=req.body.phone
}
if(req.body.salary){
    if(employee.salary==req.body.salary){
        return next(new Error(`this is same salary `,{cause:400}))
    }
  
    employee.salary=req.body.salary
}
await employee.save()

return res.status(201).json({message:"success",employee})
})
export const getEmployees =asyncHandler(async(req,res,next)=>{
    const employee = await employeeModel.find()
    return res.status(200).json({message:"success",employee})
})
export const getEmployee =asyncHandler(async(req,res,next)=>{
    const{employeeId}=req.params
    const employee = await employeeModel.findById(employeeId)
    if(!employee){
        return next(new Error(`employee not found `,{cause:400}))
    }
    return res.status(200).json({message:"success",employee})
})
export const deleteEmployee =asyncHandler(async(req,res,next)=>{
    const {employeeId}=req.params
    const employee = await employeeModel.findByIdAndDelete(employeeId)
    if(!employee){
        return next(new Error(`employee not found `,{cause:400}))  
    }
    return res.status(200).json({message:"success"})
})
export const changeStatus =asyncHandler(async(req,res,next)=>{
    const {employeeId}=req.params
    let employee = await employeeModel.findById(employeeId)
    let now =new Date()
    
    employee.time =now.toTimeString()
    
    
     let data ='16'
     let time ='08'
  
            if(employee.time>= data || employee.time<time){
                
                   
                employee= await employeeModel.findByIdAndUpdate(employeeId,{status:"Not_Active",time:employee.time },{new:true})
                   
               }
            
         
    
     else{
        employee= await employeeModel.findByIdAndUpdate(employeeId,{status:"Active",time:employee.time})
     }
     return res.json({message:"Success",employee})
    }
    )
export const addProduct =asyncHandler(async(req,res,next)=>{
    const {products,couponName,address,phoneNumber,distributorsName}=req.body
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
        req.body.coupon=coupon
    }
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
    }
    const distributors =await distributorsModel.create({
        distributorsName,
        userId:req.user._id ,
        address,
        phoneNumber,
        products:finalProductList,
        subTotal,
        couponId:req.body.coupon?._id,
        finalPrice:subTotal- (subTotal*(req.body.coupon?.amount||0)/100),
    })
    
    for(const product of products){
        await productModel.updateOne({_id:product.productId},{$inc:{stock:-product.qty}})
       }
       if(req.body.coupon){
        await couponModel.updateOne({_id:req.body.coupon._id},{$addToSet:{usedBy:req.user._id}})
       }
       await cartModel.updateOne({userId:req.user._id},{
        $pull:{
            products:{
                productId:{$in:productIds}
            }
        }
                })
                const invoice = {
                    shipping: {
                        name: req.user.userName,
                        address,
                        city: "Qalqilya",
                        
                    },
                    items:distributors.products,
                    subTotal:distributors.subTotal,
                    total:distributors.finalPrice,
                    invoice_nr: distributors._id
                };
               
                createInvoice(invoice, "invoiceEmployee.pdf");  
                 
                await sendEmail(req.user.email,'infinity light-invoice','welcome',{
                   
                    path:'invoiceEmployee.pdf',
                    contentType:'application/pdf'
                })    
               
                return res.status(200).json({message:"success",distributors})
                
 })

 export const addproducttostock =asyncHandler(async(req,res,next)=>{
   const {stockManagementId,suppliersId}=req.params
   const StockManagement=await stockManagementModel.findById(stockManagementId)
let supplier=await supplierModel.findById(suppliersId)
const {products,couponName,address,phoneNumber,name,employeeId,supplierId,distributorsId}=req.body
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
        req.body.coupon=coupon
    }
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
        }
       if(!suppliersId){
        return next(new Error('suppliers not found'),{cause:400})
       }
         supplier= await supplierModel.findByIdAndUpdate(suppliersId,{
            $pull:{
                products:{
                    productId:{$in:productIds}
                }
            }
         } )
                    
        const stockManagement =await stockManagementModel.findByIdAndUpdate(stockManagementId,{
            
            products:finalProductList,
            
           })
           for(const product of products){
            await productModel.updateOne({_id:product.productId},{$inc:{stock:-product.qty}})
           }
           if(req.body.coupon){
            await couponModel.updateOne({_id:req.body.coupon._id},{$addToSet:{usedBy:req.user._id}})
           }
          
         
                    const invoice = {
                        shipping: {
                            name: req.user.userName,
                            address,
                            city: "Qalqilya",
                            
                        },
                        items:stockManagement.products,
                        subTotal:stockManagement.subTotal,
                        total:stockManagement.finalPrice,
                        invoice_nr: stockManagement._id
                    };
                   
                    createInvoice(invoice, "invoiceStock.pdf");  
                     
                    await sendEmail(req.user.email,'infinity light-invoice','welcome',{
                       
                        path:'invoiceStock.pdf',
                        contentType:'application/pdf'
                    })    
                   
                    return res.status(200).json({message:"success",stockManagement})
                    
     })
export const updateVacationEmployee =asyncHandler(async(req,res,next)=>{
    const {employeeId}=req.params
    const {hollyday}=req.body
    const employee =await employeeModel.findById(employeeId)
    if(!employee){
        return next(new Error(`employee not found`,{cause:404}))
    }
    const user =await userModel.findById({_id:req.user._id})
    if(employee.vacation < '0' ||user.message=='no'){
        return next(new Error(`can't take vacation more`,{cause:404}))
    }
   const vacation=  employee.vacation
   
   const Employee= await employeeModel.findByIdAndUpdate(employeeId,{$inc:{vacation:-hollyday}},{new:true})
    return res.status(201).json({message:"success",Employee})

})
     
    
export const addProductFromStockToDistributor = asyncHandler(async (req, res, next) => {
    const { distributorsId, stockManagementId } = req.params;
    const { products, couponName, address, phoneNumber, name, employeeId, supplierId } = req.body; // [{ id:01 , q:2}]
    if (couponName) {
        const coupon = await couponModel.findOne({ name: couponName.toLowerCase() })
        if (!coupon) {
            return next(new Error(`invalid coupon ${couponName}`, { cause: 404 }))
        }
        let now = moment()
        let parsed = moment(coupon.expireDate, 'DD/MM/YYYY')
        let diff = now.diff(parsed, 'days')
        if (diff >= 0) {
            return next(new Error(` coupon expired ${couponName}`, { cause: 404 }))
        }
        if (coupon.usedBy.includes(req.user._id)) {
            return next(new Error(` coupon already used by  ${req.user._id}`, { cause: 404 }))
        }
        req.body.coupon = coupon
    }

let stockManagement = await stockManagementModel.findById(stockManagementId);
if(!stockManagement){
    return next(new Error(`stock not found`,{cause:404}))
}
let distributors = await distributorsModel.findById(distributorsId);

if(!distributors){
     distributors=await distributorsModel.findByIdAndUpdate(distributorsId,{products},{new :true})
    return next(new Error(`distributor not found`,{cause:404}))
}
    for (let product of products) {
     
      await distributorsModel.updateOne(
            { _id: distributorsId, 'products.productId': product.productId },
            { $inc: { 'products.$.qty': product.qty } }
        );
        
        let matchProduct=false
        for(let i=0;i<distributors.products.length;i++){
            if(distributors.products[i].productId.toString()==product.productId){

                const checkProduct=await productModel.findOne({
                    _id:product.productId,
                    stock:{$gte:product.qty},
                    deleted:false
                })
    if(!checkProduct){
        return next(new Error(`invalid product`,{cause:404}))
        
    }
    let qty= distributors.products[i].qty
    let finalPrice =distributors.products[i].finalPrice
    finalPrice=qty*checkProduct.finalPrice
    
    
    matchProduct=true
    
    let subTotal=0
    for (let product of distributors.products){
        
        product.finalPrice=finalPrice
        
        
        
        distributors.subTotal=subTotal+product.finalPrice
        distributors.finalPrice=distributors.subTotal-(distributors.subTotal*(req.body.coupon?.amount||0)/100)
        await distributors.save()
        
    }
    }}
    }
    

     for (let Product of products) {
      
     await stockManagementModel.updateOne({ _id: stockManagementId,'products.productId': Product.productId },
         { $inc: { 'products.$.qty': -Product.qty }  });
          
         
         
         
         let matchProduct=false
         for(let i=0;i<stockManagement.products.length;i++){
       
             if(stockManagement.products[i].productId.toString()==Product.productId){
        
        const checkProduct=await productModel.findOne({
            _id:Product.productId,
            stock:{$gte:Product.qty},
            deleted:false
    })
    if(!checkProduct){
        return next(new Error(`invalid product`,{cause:404}))
        
    }
    let qty= stockManagement.products[i].qty
  
   if(qty < 0){
       return next(new Error(`can't add product because the qty is empty`,{cause:404}))
    }
   let finalPrice =stockManagement.products[i].finalPrice
  finalPrice=qty*checkProduct.finalPrice
  
  
  matchProduct=true
  
  let subTotal=0
  for (let product of stockManagement.products){
      
      product.finalPrice=finalPrice
      
      
      
      stockManagement.subTotal=subTotal+product.finalPrice
      stockManagement.finalPrice=stockManagement.subTotal-(stockManagement.subTotal*(req.body.coupon?.amount||0)/100)
      await stockManagement.save()
   
      
    }
}
}
}


 
    const updatedDistributors = await distributorsModel.findById(distributorsId);
    
    return res.status(200).json({ message: "Success"});
    

});
// for (const product of products){
//     const checkProduct=await productModel.findOne({
//         _id:product.productId,
//         stock:{$gte:product.qty},
//         deleted:false
//     })
//     if(!checkProduct){
//         return next(new Error(`invalid product`,{cause:404}))
        
//     }
//     product.name=checkProduct.name
//     product.unitPrice=checkProduct.finalPrice
//     product.finalPrice=product.qty*checkProduct.finalPrice
//     subTotal+=product.finalPrice
//     productIds.push(product.productId)
//     finalProductList.push(product)
// }