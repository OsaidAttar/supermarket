import {Router} from 'express'
import { auth } from '../../MiddelWare/auth.middelware.js'
import { endpoint } from './distributors.endPoint.js'
import * as distributorController from'./controller/distributors.controller.js'
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js'
const router=Router({mergeParams: true})
router.post('/',auth(endpoint.create),fileUpload(fileValidation.image).single('image'),distributorController.createDistributors)
export default router
//update 
//delete
//get all
// get
// get product
// update status active or not by time
