import {Router} from 'express'
import { auth } from '../../MiddelWare/auth.middelware.js'
import * as SuppliersController from'./controller/Suppliers.controller.js'
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js'
import { endpoint } from './Suppliers.endPoint.js'
import validation from '../../MiddelWare/validation.js'
import *as validate from './Suppliers.validation.js'
const router=Router()
router.post('/',auth(endpoint.create),fileUpload(fileValidation.image).single('image'),validation(validate.createSupplier),SuppliersController.createSuppliers)
router.put('/update/:suppliersId',auth(endpoint.update),fileUpload(fileValidation.image).single('image'),validation(validate.updateSupplier),SuppliersController.updateSuppliers)
router.get('/all',SuppliersController.getSuppliers)
router.get('/:suppliersId',SuppliersController.getSupplier)
router.delete('/delete/:suppliersId',auth(endpoint.delete),SuppliersController.deleteSupplier)
router.put('/updatestatus/:suppliersId',auth(endpoint.update),SuppliersController.updateStatus)
router.post('/addproduct/:suppliersId',auth(endpoint.update),SuppliersController.addProduct)

export default router


