import {Router} from 'express'
import { auth } from '../../MiddelWare/auth.middelware.js'
import * as SuppliersController from'./controller/Suppliers.controller.js'
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js'
import { endpoint } from './Suppliers.endPoint.js'

const router=Router({mergeParams: true})
router.post('/',auth(endpoint.create),fileUpload(fileValidation.image).single('image'),SuppliersController.createSuppliers)
export default router