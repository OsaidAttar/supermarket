import {Router} from 'express'
import * as userController from './controller/User.controller.js'
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js';
import validation from '../../MiddelWare/validation.js';
import * as validtors from './User.validation.js'
import { auth, roles } from '../../MiddelWare/auth.middelware.js';
import { endpoint } from './User.endPoint.js';
const router =Router()
router.post('/profile/:userId',validation(validtors.profile),fileUpload(fileValidation.image).single('image'),userController.userProfile)
router.put('/profile/update/:userId',auth(endpoint.update),fileUpload(fileValidation.image).single('image'),validation(validtors.updateProfile),userController.updateUserProfile)
router.delete('/profile/delete/:userId',auth(endpoint.delete),fileUpload(fileValidation.image).single('image'),userController.deleteUserProfile)
router.patch('/updatepassword',auth(endpoint.update),validation(validtors.updatePassword),userController.updatePassword)
router.get('/:id/shareprofile',auth(Object.values(roles)),validation(validtors.shareProfile),userController.shareProfile);





export default router