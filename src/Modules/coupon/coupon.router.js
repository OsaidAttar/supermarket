import {Router} from 'express'
import { auth } from '../../MiddelWare/auth.middelware.js'
import { endpoint } from './coupon.endPoint.js'
import validation from '../../MiddelWare/validation.js'
import *as validator from './coupon.validation.js'
import * as couponController from './controller/coupon.controller.js'

const router=Router()
router.post('/',auth(endpoint.create),validation(validator.couponCreate),couponController.createCoupon)
router.put('/update/:couponId',auth(endpoint.update),validation(validator.Couponupdate),couponController.updateCoupon)
router.get('/:couponId',couponController.getCoupon)
router.get('/',couponController.getCoupons)
router.delete('/delete/:couponId',auth(endpoint.delete),couponController.deleteCoupon)


export default router