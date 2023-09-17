import {Router} from 'express'
import { auth } from '../../MiddelWare/auth.middelware.js'
import * as stockManagementController from'./controller/stockManagement.controller.js'
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js'
import { endpoint } from './stockManagement.endPoint.js'
import Suppliers from '../Suppliers/Suppliers.router.js'
import employee from '../Employee/Employee.router.js'
import distributors from '../distributors/distributors.router.js'
import validation from '../../MiddelWare/validation.js'
import *as validate from './stockManagement.validation.js'
const router=Router({mergeParams: true})

router.use('/:stockManagementId/suppliers',Suppliers)
router.use('/:stockManagementId/distributors',distributors)
router.post('/',auth(endpoint.create),fileUpload(fileValidation.image).single('image'),stockManagementController.createstockManagement)
//router.post('/:stockManagementId/employee',auth(endpoint.create),fileUpload(fileValidation.image).single('image'),validation(validate.createEmployeestockManagement),stockManagementController.createEmployeestockManagement)

export default router