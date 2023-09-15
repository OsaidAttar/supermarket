import  Mongoose ,{Schema,Types,model} from "mongoose";
const orderSchema=new Schema({
    userId:{type:Types.ObjectId,ref:'User',required:true},
    address:{type:String,required:true},
    phoneNumber:[{type:String,required:true}],
    products:[{
       name:{type:String},
        productId:{type:Types.ObjectId,ref:'Product',required:true},
        qty:{type:Number,default:1,required:true},
        unitPrice:{type:Number},
        finalPrice:{type:Number},
    
    }],
   couponId:{type:Types.ObjectId,ref:'Coupon'},
   subTotal:{type:Number},
   finalPrice:{type:Number},
   paymentType:{type:String,default:'cash',enum:['cash','card']},
   status:{type:String,default:'pending',enum:['pending','canceled','approved','onWay','delivered']}, // pending يتصلوا عليك عشان يشوفو كل اشي تمام موافق على الطلب الشركة
   reasonReject:String,
   note:{type:String},
   updatedBy:{type:Types.ObjectId,ref:'User'},

},{
   
    timestamps:true
})

const orderModel=Mongoose.models.Order ||model('Order',orderSchema)
export default orderModel
