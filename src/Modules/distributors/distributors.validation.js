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
export const getCategory=joi.object({
    categoryId:generalFeilds.id
}).required()