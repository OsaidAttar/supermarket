import {Router} from 'express'
import * as cartController from './controller/cart.controller.js'
import { auth } from '../../MiddelWare/auth.middelware.js'
import { endpoint } from './cart.endPoint.js'
import *as validator from './cart.validation.js'
import validation from "../../MiddelWare/validation.js"
const router=Router()

router.post('/',auth(endpoint.create),validation(validator.createCart),cartController.addProductToCart)
router.patch('/deleteitem',auth(endpoint.delete),cartController.deleteItem)
router.patch('/clearcart',auth(endpoint.delete),cartController.clearCart)
router.get('/',auth(endpoint.create),cartController.getCart)


export default router