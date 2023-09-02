import {Router} from 'express'
import * as userController from './controller/User.controller.js'
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js';
import validation from '../../MiddelWare/validation.js';
import * as validtors from './User.validation.js'
import { auth, roles } from '../../MiddelWare/auth.middelware.js';
import { endpoint } from './User.endPoint.js';
const router =Router()
router.post('/profile/:userId',fileUpload(fileValidation.image).single('image'),userController.userProfile)
router.put('/profile/update/:userId',auth(endpoint.update),validation(validtors.updateProfile),fileUpload(fileValidation.image).single('image'),userController.updateUserProfile)
router.delete('/profile/delete/:userId',auth(endpoint.delete),fileUpload(fileValidation.image).single('image'),userController.deleteUserProfile)
router.patch('/updatepassword',auth(endpoint.update),validation(validtors.updatePassword),userController.updatePassword)
router.get('/:id/shareprofile',auth(Object.values(roles)),validation(validtors.shareProfile),userController.shareProfile);
router.post('/addAdmin',auth(endpoint.create),userController.addAdmin)
router.post('/updateAdmin/:adminId',auth(endpoint.update),validation(validtors.updateAdmin),userController.updateAdmin)
router.delete('/deleteAdmin/:adminId',auth(endpoint.delete),userController.deleteAdmin)
router.get('/getallAdmin',auth(endpoint.getAllAdmin),userController.getAllAdmin)
router.get('/getAdmin/:adminId',auth(endpoint.getAllAdmin),validation(validtors.getAdmin),userController.getAdmin)
router.patch('/updateStatusAdmin/:adminId',auth(endpoint.update),validation(validtors.updateStatusAdmin),userController.updateStatusAdmin)




export default router