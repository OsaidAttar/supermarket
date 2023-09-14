import {Router} from 'express'
import { auth } from '../../MiddelWare/auth.middelware.js'
import * as subcategoryController from './controller/subcategory.controller.js'
import { endpoint } from '../category/category.endPoint.js'
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js'
import validation from '../../MiddelWare/validation.js'
import * as validator from './subcategory.validation.js'

const router=Router({mergeParams: true})

router.post('/',auth(endpoint.create),fileUpload(fileValidation.image).single('image'),validation(validator.createSubCategory),subcategoryController.createSubCategory)
router.put('/update/:subcategoryId',auth(endpoint.update),fileUpload(fileValidation.image).single('image'),validation(validator.subCategoryUpdate),subcategoryController.updateSubCategory)
router.delete('/delete/:subcategoryId',auth(endpoint.delete),subcategoryController.deleteSubCategory)
router.get('/all',subcategoryController.getSubcategories)
router.get('/:subcategoryId',subcategoryController.getSubcategory)
router.get('/:subcategoryId/products',subcategoryController.getProduct)




export default router