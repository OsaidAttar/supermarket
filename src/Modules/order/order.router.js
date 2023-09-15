import {Router} from 'express'
import { auth } from '../../MiddelWare/auth.middelware.js'
import { endpoint } from './order.endPoint.js'
import * as orderController from './controller/order.controller.js'

const router=Router()
router.post('/',auth(endpoint.create),orderController.createOrder)
router.post('/allItemFromCart',auth(endpoint.create),orderController.createOrderWithAllItemFromCart)
router.patch('/cancelorder/:orderId',auth(endpoint.update),orderController.cancelOrder)
router.patch('/changestatusfromadmin/:orderId',auth(endpoint.update),orderController.updateOrderStatusFromAdmin)

export default router