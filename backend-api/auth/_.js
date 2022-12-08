import express from "express"
const router = express.Router()

//   /api/auth/login
import loginHandler from "./login.js"
router.use("/login", express.json(), loginHandler)

//   /api/auth/signup
import signupHandler from "./signup.js"
router.use("/signup", express.json(), signupHandler)

export default router

