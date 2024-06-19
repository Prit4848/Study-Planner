const express = require("express")
const router = express.Router()

const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {generateToken} = require("../utils/generateTokens");
const { registerUser,loginUser,logoutUser,getregisterUser, getloginUser} = require("../controllers/userController")
const upload = require("../config/multer-config");


router.get("/", function (req, res) {
  res.send("user connected");
});


router.get("/register",getregisterUser)
router.post("/register",upload.single("image"), registerUser);
router.get("/login",getloginUser)
router.post("/login",loginUser);
router.get("/logout",logoutUser);



module.exports = router;



