import joi from 'joi'
import {generalFeilds} from '../../MiddelWare/validation.js'

export const createEmployee=joi.object({
    employeeName:joi.string().min(2).max(20).required(),
    
    file:generalFeilds.file.required(),
    email:generalFeilds.email,
    phone:joi.number().min(10).required(),
    salary:joi.number().required()
}).required()
export const updateEmployee=joi.object({
    employeeId:generalFeilds.id,
    employeeName:joi.string().min(2).max(20),
    file:generalFeilds.file,
    phone:joi.number().min(10),
    salary:joi.number(),
    email:generalFeilds.email,

}).required()
export const confirmJob=joi.object({
    email:generalFeilds.email
}).required()
export const getCategory=joi.object({
    categoryId:generalFeilds.id
}).required()