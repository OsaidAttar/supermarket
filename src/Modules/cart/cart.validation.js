import joi from 'joi'
import {generalFeilds} from '../../MiddelWare/validation.js'
export const createCart=joi.object({
  productId:generalFeilds.id.required(),
  qty:joi.string().required()
}).required()
export const updateCategory=joi.object({
    categoryId:generalFeilds.id,
    name:joi.string().min(2).max(20),
    file:generalFeilds.file
}).required()
export const getCategory=joi.object({
    categoryId:generalFeilds.id
}).required()