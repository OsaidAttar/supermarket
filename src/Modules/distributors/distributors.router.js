import {Router} from 'express'
import { auth } from '../../MiddelWare/auth.middelware.js'
import { endpoint } from './distributors.endPoint.js'
import * as distributorController from'./controller/distributors.controller.js'
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js'
import validation from '../../MiddelWare/validation.js'
import *as validate from './distributors.validation.js'
const router=Router({mergeParams: true})
router.post('/',auth(endpoint.create),fileUpload(fileValidation.image).single('image'),validation(validate.createDistributors),distributorController.createDistributors)
router.put('/update/:distributorsId',auth(endpoint.update),fileUpload(fileValidation.image).single('image'),validation(validate.updateDistributors),distributorController.updateDistributors)
router.delete('/delete/:distributorsId',auth(endpoint.delete),distributorController.deleteDistributors)
router.get('/all',distributorController.getAllDistributors)
router.patch('/confirmjob',distributorController.confirmjob)
router.get('/:distributorsId',distributorController.getDistributor)
router.patch('/updatestatus/:distributorsId',auth(endpoint.update),distributorController.updateStatusDistributor)

export default router


//update router
