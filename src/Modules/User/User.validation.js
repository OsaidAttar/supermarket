import joi from 'joi'
import {generalFeilds} from '../../MiddelWare/validation.js'
export const profile=joi.object({
    file:generalFeilds.file
}).required()
export const updateProfile=joi.object({
    userId:generalFeilds.id,
    userName:joi.string().min(2).max(20),
    email:generalFeilds.email,
    file:generalFeilds.file
}).required()
export const updatePassword=
   joi.object({
        oldPassword:generalFeilds.password,
        newPassword:generalFeilds.password.invalid(joi.ref('oldPassword')),
        cPassword:joi.string().valid(joi.ref('newPassword')).required()
    })

export const shareProfile = 
    joi.object({
        id:generalFeilds.id
    }).required()
 