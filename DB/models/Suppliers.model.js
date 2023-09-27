import mongoose, {Schema,Types,model} from 'mongoose';
const supplierSchema = new Schema ({
    supplierName:{
        type:String,required:[true,`supplierName is required`],min:[2],max:[20]},
    email:{type:String},  
  image:{type:Object },
  phone:{type:String,},
  roles:{type:String,default:'supplier',enum:[`supplier`,`Admin`] },
  status:{type:String,default:'Active',enum:[`Active`,`Not_Active`]},
  gender:{ type:String, enum:[`Male`,`Female`]},
  address:{type:String},
  stock:{type:Number},
  products:[{
    name:{type:String},
    productId:{type:Types.ObjectId,ref:'Product',required:true},
    qty:{type:Number,required:true},
    unitPrice:{type:Number},
    finalPrice:{type:Number},
    
}],
finalPrice:{type:Number},
subTotal:{type:Number},
time:{type:String,default:'00,00,00'}
  //priceOfAllProducts:{type:Number},

},
{
    timestamps:true
})
const supplierModel = mongoose.models.Supplier ||  model('Supplier', supplierSchema);
export default supplierModel;