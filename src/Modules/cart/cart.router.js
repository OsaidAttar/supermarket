import {Router} from 'express'
import * as cartController from './controller/cart.controller.js'
import { auth } from '../../MiddelWare/auth.middelware.js'
import { endpoint } from './cart.endPoint.js'
import *as validator from './cart.validation.js'
import validation from "../../MiddelWare/validation.js"
const router=Router()
router.post('/',auth(endpoint.create),validation(validator.createCart),cartController.addProductToCart)
export default router