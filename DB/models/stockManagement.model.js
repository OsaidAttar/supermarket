import  Mongoose ,{Schema,Types,model} from "mongoose";
const stockManagementSchema=new Schema({
name:{type:String,required:true},
slug:{type:String},
 supplierId:{type:Types.ObjectId,ref:'Supplier',required:true},
employeeId:{type:Types.ObjectId,ref:'Employee',required:true},
distributorsId:{type:Types.ObjectId,ref:'Distributors',required:true},

products:[{
    name:{type:String,required:true},
    productId:{type:Types.ObjectId,ref:'Product',required:true},
    qty:{type:Number,default:1,required:true},
    unitPrice:{type:Number,required:true},
    finalPrice:{type:Number,required:true},
    
}],
subTotal:{type:Number},
shipmentStatus:{type:String,default:'Acceptable',enum:[`Acceptable`,`Not_Acceptable`]},
finalPrice:{type:Number},
categoryId:{type:Types.ObjectId,ref:'Category'},
subCategoryId:{type:Types.ObjectId,ref:'SubCategory'},
createdBy:{type:Types.ObjectId,ref:'Employee'},
updatedBy:{type:Types.ObjectId,ref:'Employee'},
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    timestamps:true
})
stockManagementSchema.virtual('employeestock',{
    localField:'_id',
    foreignField:'stockManagementId',
    ref:'Employee'

})

const stockManagementModel=Mongoose.models.StockManagement ||model('StockManagement',stockManagementSchema)
export default stockManagementModel