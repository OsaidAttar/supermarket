import joi from 'joi'
import {generalFeilds} from '../../MiddelWare/validation.js'

    export const updateAdmin = 
    joi.object({
        adminId:generalFeilds.id,
        roles:joi.string()

    }).required()
    export const getAdmin = 
    joi.object({
        adminId:generalFeilds.id
    }).required()
    export const updateStatusAdmin = 
    joi.object({
        adminId:generalFeilds.id,
        status:joi.string().required()
    }).required()