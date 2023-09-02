import connectDB from "../../DB/conncetion.js"
import categoryRouter from './category/category.router.js'
import authRouter from './auth/auth.router.js'
import cartRouter from './cart/cart.router.js'
import couponRouter from './coupon/coupon.router.js'
import distributorsRouter from './distributors/distributors.router.js'
import employeeRouter from './Employee/Employee.router.js'
import orderRouter from './order/order.router.js'
import productRouter from './product/product.router.js'
import stockmanagementRouter from './stockManagement/stockManagement.router.js'
import subcategory from './subcategory/subcategory.router.js'
import suppliersRouter from './Suppliers/Suppliers.router.js'
import userRouter from './User/User.router.js'
import {globalErrorHandler} from '../Services/errorHandling.js'
const initApp=(app,express)=>{
    connectDB();
    app.use(express.json())
    app.use('/category',categoryRouter)
    app.use('/auth',authRouter)
    app.use('/cart',cartRouter)
    app.use('/coupon',couponRouter)
    app.use('/distributors',distributorsRouter)
    app.use('/employee',employeeRouter)
    app.use('/order',orderRouter)
    app.use('/product',productRouter)
    app.use('/stockmanagement',stockmanagementRouter)
    app.use('/subcategory',subcategory)
    app.use('/suppliers',suppliersRouter)
    app.use('/user',userRouter)
    app.use('/*',(req,res)=>{
return res.json({message:"page not found"})
    })
    app.use(globalErrorHandler)
}
export default initApp