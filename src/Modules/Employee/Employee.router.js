import {Router} from 'express'
import { auth } from '../../MiddelWare/auth.middelware.js'
import * as EmployeeController from'./controller/Employee.controller.js'
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js'
import { endpoint } from './Employee.endPoint.js'
import validation from '../../MiddelWare/validation.js'
import *as validate from './Employee.validation.js'
const router=Router({mergeParams: true,caseSensitive:true})
router.post('/',auth(endpoint.create),fileUpload(fileValidation.image).single('image'),validation(validate.createEmployee),EmployeeController.createEmployee)
router.put('/update/:employeeId',auth(endpoint.update),fileUpload(fileValidation.image).single('image'),validation(validate.updateEmployee),EmployeeController.updateEmployee)
router.get('/all',EmployeeController.getEmployees)
router.get('/:employeeId',EmployeeController.getEmployee)
router.delete('/delete/:employeeId',auth(endpoint.delete),EmployeeController.deleteEmployee)
router.put('/changeStatus/:employeeId',auth(endpoint.update),EmployeeController.changeStatus)
router.post('/addproduct',auth(endpoint.addProduct),EmployeeController.addProduct)
router.post('/addproducttostock/:stockManagementId/supplier/:suppliersId',auth(endpoint.addProduct),EmployeeController.addproducttostock)
router.patch('/updatevacation/:employeeId',auth(endpoint.update),EmployeeController.updateVacationEmployee)
router.post('/addProductFromStock/:stockManagementId/distributor/:distributorsId',auth(endpoint.addProduct),EmployeeController.addProductFromStockToDistributor)
router.patch('/confirmjob',validation(validate.confirmJob),EmployeeController.confirmjob)

export default router

