import {Router} from 'express'
import { auth } from '../../MiddelWare/auth.middelware.js'
import { endpoint } from './order.endPoint.js'
import * as orderController from './controller/order.controller.js'

const router=Router()
router.post('/',auth(endpoint.create),orderController.createOrder)
export default router