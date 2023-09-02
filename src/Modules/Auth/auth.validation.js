import joi from 'joi'
import {generalFeilds} from '../../MiddelWare/validation.js'
export const signupSchema=joi.object({
    userName:joi.string().alphanum().min(3).max(20).required().messages({
        'any.required':'userName is required',
        'string empty':'userName is required'
    }),
    email:generalFeilds.email,
    password:generalFeilds.password,
   cPassword:joi.string().valid(joi.ref("password")).required()
}).required()
export const loginSchema=joi.object({
    email:generalFeilds.email,
    password:generalFeilds.password
}).required()
export const token=joi.object({
    token:joi.string().required()
}).required()

export const sendCode = 
joi.object({
 email:generalFeilds.email
     
 }).required();
 
 export const forgetPassword=joi.object({
 email:generalFeilds.email,
 password:generalFeilds.password,
 cPassword:joi.string().valid(joi.ref('password')).required(),
 code:joi.string().required()   
 }).required();