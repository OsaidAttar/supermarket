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

router.put('/update/:productId',auth(endpoint.update),fileUpload(fileValidation.image).fields([
    {name:'mainImages',maxCount:1},
    {name:'subImages',maxCount:5}
]),validation(validtors.ProductUpdate),productController.updateProduct)
router.patch('/softdelete/:productId',auth(endpoint.softdelete),productController.softDelete)
router.delete('/forcedelete/:productId',auth(endpoint.forcedelete),productController.forceDelete)
router.patch('/restore/:productId',auth(endpoint.restore),productController.restore)
router.get('/softdelete',auth(endpoint.get),productController.getSoftDeleteProducts)
router.get('/:productId',productController.getProduct)
router.get('/',productController.getProducts)


export default router