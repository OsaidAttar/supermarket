import mongoose, {Schema,Types,model} from 'mongoose';
const supplierSchema = new Schema ({
    supplierName:{
        type:String,required:[true,`supplierName is required`],min:[2],max:[20]},
    email:{type:String},  
  image:{type:Object },
  phone:{type:String,},
  role:{type:String,default:'supplier',enum:[`supplier`,`Admin`] },
  status:{type:String,default:'Active',enum:[`Active`,`Not_Active`]},
  gender:{ type:String, enum:[`Male`,`Female`]},
  address:{type:String},
  stock:{type:Number},
  products:[{
    name:{type:String,required:true},
    productId:{type:Types.ObjectId,ref:'Product',required:true},
    qty:{type:Number,default:1,required:true},
    unitPrice:{type:Number,required:true},
    finalPrice:{type:Number,required:true},
    
}],
  priceOfAllProducts:{type:Number},

},
{
    timestamps:true
})
const supplierModel = mongoose.models.Supplier ||  model('Supplier', supplierSchema);
export default supplierModel;