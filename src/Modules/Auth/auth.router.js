import { Router } from "express";
import *as authController from './controller/auth.controller.js'
import * as validator from './auth.validation.js'
import validation from "../../MiddelWare/validation.js";
import {asyncHandler} from '../../Services/errorHandling.js'
const router=Router()
router.post('/signup',validation(validator.signupSchema),authController.signUp)
router.post('/signin',validation(validator.loginSchema),authController.Login)
router.get('/confirmEmail/:token',validation(validator.token),authController.confirmEmail)
router.get('/NewconfirmEmail/:token',validation(validator.token),authController.NewconfirmEmail)
router.patch('/forgetpassword',validation(validator.forgetPassword),authController.forgetPassword)
router.patch('/sendCode',validation(validator.sendCode),authController.sendCode)

export default router