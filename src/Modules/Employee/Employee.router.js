import {Router} from 'express'
import { auth } from '../../MiddelWare/auth.middelware.js'
import * as EmployeeController from'./controller/Employee.controller.js'
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js'
import { endpoint } from './Employee.endPoint.js'
const router=Router({mergeParams: true})
router.post('/',auth(endpoint.create),fileUpload(fileValidation.image).single('image'),EmployeeController.createEmployee)
export default router
//super admin add task to employee