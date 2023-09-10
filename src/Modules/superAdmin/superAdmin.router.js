import {Router} from 'express'
import * as superAdminController from './controller/superAdmin.controller.js'
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js';
import validation from '../../MiddelWare/validation.js';
import * as validtors from './superAdmin.validation.js'
import { auth, roles } from '../../MiddelWare/auth.middelware.js';
import { endpoint } from './superAdmin.endPoint.js';
const router =Router()
router.post('/addAdmin',auth(endpoint.create),superAdminController.addAdmin)
router.post('/updateAdmin/:adminId',auth(endpoint.update),validation(validtors.updateAdmin),superAdminController.updateAdmin)
router.delete('/deleteAdmin/:adminId',auth(endpoint.delete),superAdminController.deleteAdmin)
router.get('/getallAdmin',auth(endpoint.getAllAdmin),superAdminController.getAllAdmin)
router.get('/getAdmin/:adminId',auth(endpoint.getAllAdmin),validation(validtors.getAdmin),superAdminController.getAdmin)
router.patch('/updateStatusAdmin/:adminId',auth(endpoint.update),validation(validtors.updateStatusAdmin),superAdminController.updateStatusAdmin)
export default router
//super admin add task to employee