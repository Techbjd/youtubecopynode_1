import {Router} from "express"
import {healthcheck} from "../controllers/healthcheck.controllers.js"
import { upload } from "../middlewares/multer.middleware.js"


const router=Router()
router.route("/").get(healthcheck)
router.route("/test").post(upload.single('avatar'), healthcheck)

export default router