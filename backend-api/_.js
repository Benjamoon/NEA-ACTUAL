import express from "express" //Import express
const router = express.Router() //Create a new router 

//  /api/auth
import authRouter from "./auth/_.js"
router.use("/auth", authRouter)

//  /api/user
import userRouter from "./user/_.js"
router.use("/user", userRouter)

export default router // Export this router

