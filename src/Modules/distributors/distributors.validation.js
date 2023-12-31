import joi from 'joi'
import {generalFeilds} from '../../MiddelWare/validation.js'
export const createDistributors=joi.object({
    
    distributorsName:joi.string().min(2).max(20).required(),
    file:generalFeilds.file.required(),
    phoneNumber:joi.number().required(),
    email:generalFeilds.email,
    productId:generalFeilds.id,
}).required()

export const updateDistributors=joi.object({
    distributorsName:joi.string().min(2).max(20),
    file:generalFeilds.file,
    phoneNumber:joi.number(),
    email:generalFeilds.email,
    productId:generalFeilds.ids,
    stockManagementId:generalFeilds.ids,
    distributorsId:generalFeilds.id
}).required()
export const confirmJob=joi.object({
    email:generalFeilds.email
}).required()
export const token=joi.object({
    token:joi.string().required()
}).required()