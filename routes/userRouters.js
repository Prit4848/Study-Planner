const express = require("express")
const router = express.Router()
const multer = require("multer")

const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {generateToken} = require("../utils/generateTokens");
const { registerUser,loginUser,logoutUser,getregisterUser, getloginUser,uploadProfileImage,AccountUpdate,contactUs,getforgot_password,postforgot_password,postEnter_otp,postChange_password} = require("../controllers/userController")
const upload = require("../config/multer-config");
const isloggedin = require("../middleware/isLoggedin")


router.get("/", function (req, res) {
  res.send("user connected");
});


router.get("/register",getregisterUser)
router.post("/register", registerUser);
router.get("/login",getloginUser)
router.post("/login",loginUser);
router.get("/logout",logoutUser);
router.post("/account/update",isloggedin,AccountUpdate)
router.post("/account/upload-profile-image/:userid",upload.single("image"),uploadProfileImage);

//contactus
router.post("/contactUs",contactUs)

//forgot password
router.get("/forgot_pass",getforgot_password)
// router.get("/enter_otp",enter_otp)
// router.get("/change_pass",change_password)

router.post("/forgot_pass",postforgot_password)
router.post("/enter_otp",postEnter_otp)
router.post("/change_pass",postChange_password)

module.exports = router;



