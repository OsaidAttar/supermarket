import joi from 'joi'
import {generalFeilds} from '../../MiddelWare/validation.js'
export const createCategory=joi.object({
    name:joi.string().min(2).max(20).required(),
    file:generalFeilds.file.required()
}).required()
export const updateCategory=joi.object({
    categoryId:generalFeilds.id,
    name:joi.string().min(2).max(20),
    file:generalFeilds.file
}).required()
export const getCategory=joi.object({
    categoryId:generalFeilds.id
}).required()
export const createEmployeestockManagement=joi.object({
    employeeName:joi.string().min(2).max(20).required(),
    stockManagementId:generalFeilds.id,
    file:generalFeilds.file.required(),
    email:generalFeilds.email,
    phone:joi.number().min(10).required(),
    salary:joi.number().required()
}).required()