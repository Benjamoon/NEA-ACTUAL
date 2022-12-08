import express from "express"
const router = express.Router()

import settingsHandler from "./settings.js"
router.use("/:user/settings", express.json(), settingsHandler)

export default router