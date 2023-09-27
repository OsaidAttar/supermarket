import joi from 'joi'
import {generalFeilds} from '../../MiddelWare/validation.js'
export const createstockManagement=joi.object({
    name:joi.string().min(2).max(20).required(),
    categoryId:generalFeilds.id,
    subCategoryId:generalFeilds.id,
    supplierId:joi.array().required(),
    employeeId:joi.array().required(),
    distributorsId:generalFeilds.id,

}).required()
export const updatestockManagemen=joi.object({
    name:joi.string().min(2).max(20),
    categoryId:generalFeilds.ids,
    subCategoryId:generalFeilds.ids,
    supplierId:joi.array(),
    employeeId:joi.array(),
    distributorsId:generalFeilds.ids,
    stockmanagementId:generalFeilds.id
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