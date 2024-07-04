const userModel = require("../models/user-model");
const planModel = require("../models/plan-model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateTokens");
const isLoggedin = require("../middleware/isLoggedin")

module.exports.registerUser = async function (req, res) {
  try {
    let { username, email, password } = req.body;

        let user = await userModel.findOne({ $or: [{ email: email }, { username: username }] });
        if(user) return res.status(401).send("you alreddy have an account,please login !!")
           
    bcrypt.genSalt(12, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) return res.send(err.message);
        else {
          let user = await userModel.create({
            image:req.file.buffer,
            username,
            email,
            password: hash,
          });

          let token = generateToken(user);
          res.cookie("token", token);
          let plan = await planModel.find({ userId: user._id });
          res.render("dashbord",{user,plan})
        }
      });
    });
  } catch (err) {
    res.send(err.message);
  }
};

module.exports.loginUser = async function (req, res) {
  try {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email: email });
    if (!user) return res.send("email or password are incorect !!");

    bcrypt.compare(password, user.password, async function (err, result) {
      if (result) {
        let token = generateToken(user);
        res.cookie("token", token);
        let plan = await planModel.find({ userId: user._id });
       res.redirect("/dashboard")
      } else {
        res.send("email or password are incorect !!");
      }
    });
  } catch (err) {
    res.send(err.message);
  }
};

module.exports.logoutUser = async function(req,res){
    res.cookie("token","")
    res.redirect("/")

}

module.exports.getregisterUser = function(req,res){
  let {email} = req.body;
  let user  = userModel.findOne({email:email})
  res.render("register",{user})
}

module.exports.getloginUser = function(req,res){
  let {email} =req.body;
  let user =  userModel.findOne({email:email})
  res.render("login",{user})
}

module.exports.uploadProfileImage = async function(req,res){
  try {
    let user = await userModel.findOneAndUpdate(
      { _id: req.params.userid },
      { image: req.file.buffer },
      { new: true }
    );

    await user.save();
    res.redirect(`/Account/${user._id}`);
  } catch (err) {
    res.send(err.message);
  }
}

module.exports.AccountUpdate = async function(req,res){
  let {username,email,Phone_no,Bio,password}= req.body;
  bcrypt.genSalt(12, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      if (err) return res.send(err.message);
      else {
        let user = await userModel.findOneAndUpdate({
          Bio,
          username,
          email,
          Phone_no,
          password: hash,
        });

        await user.save();
        res.redirect(`/Account/${user._id}`);
      }
    });
  });
}