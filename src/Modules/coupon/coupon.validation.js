import joi from 'joi'
import {generalFeilds} from '../../MiddelWare/validation.js'
export const couponCreate=joi.object({
    name:joi.string().min(2).max(20).required(),
    amount:joi.number().positive().min(1).max(100).required(),
    expireDate:joi.required()
}).required()
export const Couponupdate=joi.object({
    couponId:generalFeilds.id,
    name:joi.string().min(2).max(20),
    amount:joi.number().positive().min(1).max(100),
    
}).required()
export const getCategory=joi.object({
    categoryId:generalFeilds.id
}).required()