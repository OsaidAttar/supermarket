import mongoose, {Schema,Types,model} from 'mongoose';
const userSchema = new Schema ({
    userName:{
        type:String,required:[true,`userName is required`]},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    confirmEmail:{type:Boolean,default:false},
  image:{type:Object},
  phone:{type:String},
  roles:{type:String,default:'User',enum:[`User`,`Admin`,`superAdmin`,`Employee`] },
  status:{type:String,default:'Active',enum:[`Active`,`Not_Active`]},
  gender:{ type:String, enum:[`Male`,`Female`]},
  address:{type:String},
  message:{type:String,default:'yes'},
  forgetCode:{type:String,default:null},
  //wishList:{type:Types.ObjectId,ref:'Product'},
  changePasswordTime:{type:Date},
  confirmJob:{type:Boolean,default:false},
  okJob:{type:Boolean,default:false},
},
{
    timestamps:true
})
const userModel = mongoose.models.User ||  model('User', userSchema);
export default userModel;


