import {Router} from 'express'
import { auth } from '../../MiddelWare/auth.middelware.js'
import * as stockManagementController from'./controller/stockManagement.controller.js'
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js'
import { endpoint } from './stockManagement.endPoint.js'
import Suppliers from '../Suppliers/Suppliers.router.js'
import employee from '../Employee/Employee.router.js'
import distributors from '../distributors/distributors.router.js'
const router=Router({mergeParams: true})
router.use('/:stockManagementId/employee',employee)
router.use('/:stockManagementId/suppliers',Suppliers)
router.use('/:stockManagementId/distributors',distributors)
router.post('/',auth(endpoint.create),fileUpload(fileValidation.image).single('image'),stockManagementController.createstockManagement)
export default router