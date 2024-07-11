const userModel = require("../models/user-model");
const planModel = require("../models/plan-model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateTokens");
const isLoggedin = require("../middleware/isLoggedin")

module.exports.registerUser = async function (req, res) {
  try {
    let { username, email, password ,phone_no} = req.body;
      
    let user = await userModel.findOne({ $or: [{ email: email }, { username: username }] });
    if (user) return res.status(401).send("You already have an account, please login!");

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);

    user_1 = await userModel.create({
      phone_no,
      username,
      email,
      password: hash,
    });

    

    
    req.flash('success', 'You are register please login');
    res.redirect("/user/register")
    
  } catch (err) {
    res.status(500).send(err.message);
    console.log(err);
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
       res.redirect("/home")
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

module.exports.getregisterUser =  function(req,res){
  let success = req.flash("success");
  res.render("register",{success,user:false})
}

module.exports.getloginUser =  function(req,res){
  
  res.render("login",{user:false})
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
    try{   
      let {username,email,phone_no,Bio}= req.body;
      
        let user_2 = await userModel.findOneAndUpdate({email:req.user.email},{
          Bio,
          username,
          phone_no,
          
        },{new:true});

        await user_2.save();
        res.redirect(`/Account/${user_2._id}`);
      }catch(err){
       res.send(err.message)
       console.log(err)
      }
}