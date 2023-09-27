import {Router} from 'express'
import { auth } from '../../MiddelWare/auth.middelware.js'
import * as stockManagementController from'./controller/stockManagement.controller.js'
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js'
import { endpoint } from './stockManagement.endPoint.js'

import validation from '../../MiddelWare/validation.js'
import *as validate from './stockManagement.validation.js'
const router=Router()


router.post('/',auth(endpoint.create),validation(validate.createstockManagement),stockManagementController.createstockManagement)
router.put('/update/:stockmanagementId',auth(endpoint.update),validation(validate.updatestockManagemen),stockManagementController.updatestockManagement)
router.delete('/delete/:stockmanagementId',auth(endpoint.delete),stockManagementController.deletestockManagement)
router.get('/all',stockManagementController.getStockManagements)
router.get('/:stockmanagementId',stockManagementController.getStockManagement)


export default router




