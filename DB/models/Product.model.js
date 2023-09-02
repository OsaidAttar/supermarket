import  Mongoose ,{Schema,Types,model} from "mongoose";
const productSchema=new Schema({
name:{type:String,required:true,unique:true,trim:true},
slug:{type:String},
description:{type:String},
stock:{type:Number,default:1},
price:{type:Number,default:1},
finalPrice:{type:Number,default:1},
discount:{type:Number,default:0},
mainImages:{type:Object,required:true},
subImages:{type:Object,required:true},
categoryId:{type:Types.ObjectId,ref:'Category',required:true},
subCategoryId:{type:Types.ObjectId,ref:'SubCategory',required:true},
createdBy:{type:Types.ObjectId,ref:'User',required:true},
updatedBy:{type:Types.ObjectId,ref:'User',required:true},
deleted:{
    type:Boolean,
    default:false
}
},{
   
    timestamps:true
})

const productModel=Mongoose.models.Product ||model('Product',productSchema)
export default productModel
