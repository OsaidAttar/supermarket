import joi from 'joi'
import {generalFeilds} from '../../MiddelWare/validation.js'
export const createOrder=joi.object({
    phoneNumber:joi.string().required()
}).required()