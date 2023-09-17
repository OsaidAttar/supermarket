import mongoose, {Schema,Types,model} from 'mongoose';
const employeeSchema = new Schema ({
    employeeName:{
        type:String,required:[true,`employeeName is required`]},
        slug:{type:String,required:true},
    email:{type:String,required:true},  
  image:{type:Object},
  phone:{type:String,},
  userId:{type:Types.ObjectId,ref:'User'},
  status:{type:String,default:'Active',enum:[`Active`,`Not_Active`]},
  gender:{ type:String, enum:[`Male`,`Female`]},
  address:{type:String},
  roles:{type:String,default:'Employee'},
 // stockManagementId:{type:Types.ObjectId,ref:'StockManagement',required:true},
  salary:{type:Number},
  vacation:{type:Number,default:14},
  task:{type:String},
  time:{type:String,default:'00,00,00'}
  
},
{
   
    timestamps:true
})
const employeeModel = mongoose.models.employee ||  model('Employee', employeeSchema);
export default employeeModel;