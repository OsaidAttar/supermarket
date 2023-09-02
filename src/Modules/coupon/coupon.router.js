import {Router} from 'express'
import { auth } from '../../MiddelWare/auth.middelware.js'
import { endpoint } from './coupon.endPoint.js'
import validation from '../../MiddelWare/validation.js'
import *as validator from './coupon.validation.js'
import * as couponController from './controller/coupon.controller.js'

const router=Router()
router.post('/',auth(endpoint.create),couponController.createCoupon)
export default router