import {Router} from 'express'
import { auth } from '../../MiddelWare/auth.middelware.js'
import * as productController from './controller/product.controller.js'
import { endpoint } from './product.endPoint.js'
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js'
import validation from '../../MiddelWare/validation.js'
import * as validtors from './product.validation.js'


const router=Router({mergeParams:true})
router.post('/',auth(endpoint.create),fileUpload(fileValidation.image).fields([
    {name:'mainImages',maxCount:1},
    {name:'subImages',maxCount:5}
]),validation(validtors.createProduct),productController.createProduct)
export default router