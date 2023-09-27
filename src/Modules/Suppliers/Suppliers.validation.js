import joi from 'joi'
import {generalFeilds} from '../../MiddelWare/validation.js'
export const createSupplier=joi.object({
    supplierName:joi.string().min(2).max(20).required(),
    file:generalFeilds.file.required(),
    email:generalFeilds.email,
    phone:joi.number().required(),
  
}).required()
export const updateSupplier=joi.object({
    suppliersId:generalFeilds.id,
    supplierName:joi.string().min(2).max(20),
    file:generalFeilds.file,
    email:generalFeilds.email,
    phone:joi.number()
}).required()
