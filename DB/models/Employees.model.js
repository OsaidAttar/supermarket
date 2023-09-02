import mongoose, {Schema,Types,model} from 'mongoose';
const employeeSchema = new Schema ({
    employeeName:{
        type:String,required:[true,`employeeName is required`]},
    email:{type:String,required:true},  
  image:{type:Object},
  phone:{type:String,},
  userId:{type:Types.ObjectId,ref:'User'},
  status:{type:String,default:'Active',enum:[`Active`,`Not_Active`]},
  gender:{ type:String, enum:[`Male`,`Female`]},
  address:{type:String},
  stockManagementId:{type:Types.ObjectId,ref:'StockManagement',required:true},
  salary:{type:Number},
  vacation:{type:Number,default:0},
  task:{type:String},



  
  
},
{
    timestamps:true
})
const employeeModel = mongoose.models.employee ||  model('Employee', employeeSchema);
export default employeeModel;