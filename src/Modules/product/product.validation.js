import joi from 'joi'
import {generalFeilds} from '../../MiddelWare/validation.js'
export const createProduct=joi.object({
    
    price:joi.string().required(),
    stock:joi.string().required(),
    name:joi.string().min(2).max(20).required(),
    discount:joi.string(),
    file:generalFeilds.file,
    categoryId:generalFeilds.id,
    subCategoryId:generalFeilds.id,
}).required()
export const ProductUpdate=joi.object({
    productId:generalFeilds.id,
    categoryId:generalFeilds.ids,
    subCategoryId:generalFeilds.ids,
    price:joi.string(),
    stock:joi.string(),
    name:joi.string().min(2).max(20),
    file:generalFeilds.file
}).required()
export const getCategory=joi.object({
    categoryId:generalFeilds.id
}).required()