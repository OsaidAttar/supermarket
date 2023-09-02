import {Router} from 'express'
import * as categoryController from './controller/category.controller.js'
import *as validate from './category.validation.js'
import { endpoint } from './category.endPoint.js'
import validation from '../../MiddelWare/validation.js'
import { auth,roles } from '../../MiddelWare/auth.middelware.js'
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js"
import subcategory from '../subcategory/subcategory.router.js'
const router=Router({mergeParams: true})
router.use('/:categoryId/subcategory',subcategory)
router.post('/',auth(endpoint.create),fileUpload(fileValidation.image).single('image'),validation(validate.createCategory),categoryController.createCategory)
router.put('/update/:categoryId',auth(endpoint.update),fileUpload(fileValidation.image).single('image'),validation(validate.updateCategory),categoryController.updateCategory)
router.get('/:categoryId',auth(Object.values(roles)),validation(validate.getCategory),categoryController.getCategory)
router.get('/',categoryController.getCategories)
router.delete('/delete/:categoryId',auth(endpoint.delete),categoryController.deleteCategory)
export default router