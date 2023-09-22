import mongoose, {Schema,Types,model} from 'mongoose';
const distributorsSchema = new Schema ({
    distributorsName:{
        type:String ,required:true},
    email:{type:String },  
  image:{type:Object},
  phoneNumber:{type:String},
  roles:{type:String,default:'distributors',enum:[`distributors`,`Admin`] },
  status:{type:String,default:'Active',enum:[`Active`,`Not_Active`]},
  gender:{ type:String, enum:[`Male`,`Female`]},
  address:{type:String},
  products:[{
    name:{type:String,required:true},
    productId:{type:Types.ObjectId,ref:'Product',required:true},
    qty:{type:Number,required:true},
    unitPrice:{type:Number,required:true},
    finalPrice:{type:Number,required:true},
    
}],
time:{type:String,default:'00,00,00'},
subTotal:{type:Number},
finalPrice:{type:Number},
  stockManagementId:{type:Types.ObjectId,ref:'StockManagement'},
},
{
 
    timestamps:true
})

const distributorsModel = mongoose.models.Distributors ||  model('Distributors', distributorsSchema);
export default distributorsModel;