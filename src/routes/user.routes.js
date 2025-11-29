import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js"
import { verifJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post( 
    upload.fields([
        { 
            name : "avatar",
            maXCount : 1
        } ,
        {
            name : "coverImage",
            maxCount : 1
        }
    ]) ,
    registerUser)


router.route("/login").post(loginUser)

router.route("/logout").post( verifJWT , logoutUser)

export default router;
