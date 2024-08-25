const userModel = require("../models/user-model");
const planModel = require("../models/plan-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateTokens");
const isLoggedin = require("../middleware/isLoggedin");
const nodemailer = require("nodemailer"); // for sending the email

require("dotenv").config();

module.exports.registerUser = async function (req, res) {
  try {
    let { username, email, password, phone_no } = req.body;

    let user = await userModel.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (user)
      return res.status(401).send("You already have an account, please login!");

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);

    user_1 = await userModel.create({
      phone_no,
      username,
      email,
      password: hash,
    });

    req.flash("success", "You are register please login");
    res.redirect("/user/register");
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
        res.redirect("/home");
      } else {
        res.send("email or password are incorect !!");
      }
    });
  } catch (err) {
    res.send(err.message);
  }
};

module.exports.logoutUser = async function (req, res) {
  res.cookie("token", "");
  res.redirect("/");
};

module.exports.getregisterUser = function (req, res) {
  let success = req.flash("success");
  res.render("register", { success, user: false });
};

module.exports.getloginUser = function (req, res) {
  res.render("login", { user: false });
};

module.exports.uploadProfileImage = async function (req, res) {
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
};

module.exports.AccountUpdate = async function (req, res) {
  try {
    let { username, email, phone_no, Bio } = req.body;

    let user_2 = await userModel.findOneAndUpdate(
      { email: req.user.email },
      {
        Bio,
        username,
        phone_no,
      },
      { new: true }
    );

    await user_2.save();
    res.redirect(`/Account/${user_2._id}`);
  } catch (err) {
    res.send(err.message);
    console.log(err);
  }
};

//contactUs Post
module.exports.contactUs = async (req, res) => {
  try {
    let { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
      host: `smtp.gmail.com`,
      secure: false,
      port: 587,
      auth: {
        user: `${process.env.EMAIL_USER}`,
        pass: `${process.env.EMAIL_PASS}`,
      },
    });

    const mailOptions = {
      from: `${process.env.EMAIL_USER}`,
      to: `${process.env.MYEMAIL}`,
      subject: "user can contact with us",
      text: ` My name is: ${name},email ${email} and my messege ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error);
      } else {
        res.redirect("/contactUs");
      }
    });
  } catch (error) {
    console.error(error);
    res.redirect("/contactUs");
  }
};

//forgote password
module.exports.getforgot_password = async (req, res) => {
  try {
    res.render("forgot_password");
  } catch (error) {
    console.log(error);
  }
};

// module.exports.enter_otp = (req, res) => {
//   try {
//     res.render("enter_otp");
//   } catch (error) {
//     console.log(error);
//   }
// };

// module.exports.change_password = (req, res) => {
//   try {
//     res.render("change_password");
//   } catch (error) {
//     console.log(error);
//   }
// };

module.exports.postforgot_password = async (req, res) => {
  // for sending the otp on your email
  try {
    let { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    await userModel.findOneAndUpdate({ email }, { otp }, { new: true });

    const transporter = nodemailer.createTransport({
      host: `smtp.gmail.com`,
      secure: false,
      port: 587,
      auth: {
        user: `${process.env.EMAIL_USER}`,
        pass: `${process.env.EMAIL_PASS}`,
      },
    });

    const mailOptions = {
      from: `${process.env.EMAIL_USER}`,
      to: email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error);
      } else {
        console.log("OTP sent: " + info.response);
        res.render("enter_otp", { email });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.postEnter_otp = async (req, res) => {
  try {
    const { email, newotp } = req.body;

    // Find the user by email
    let user = await userModel.findOne({ email });

    // Check if user exists
    if (!user) {
      return res
        .status(404)
        .send("User not found. Please check the email address.");
    }

    // Verify the OTP
    if (user.otp != newotp) {
      return res.status(400).send("Wrong OTP, please enter the correct OTP.");
    }

    // If OTP is correct, render the change password page
    let success = req.flash("success");
    res.render("change_password", { success, email });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.postChange_password = async (req, res) => {
  try {
    let { email, newpassword } = req.body;
    console.log(newpassword);
    // Ensure the password is provided
    if (!newpassword) {
      return res.status(400).send("Password is required.");
    }

    // Generate a salt
    const salt = await bcrypt.genSalt(12);
    if (!salt) {
      throw new Error("Failed to generate salt.");
    }

    // Hash the password using the salt
    const hash = await bcrypt.hash(newpassword, salt);
    if (!hash) {
      throw new Error("Failed to hash the password.");
    }

    // Update the user's password
    let user = await userModel.findOneAndUpdate(
      { email },
      { password: hash },
      { new: true }
    );

    // Save the user
    await user.save(); // Ensure user is saved after updating

    // Flash success message and redirect
    req.flash("success", "Password changed successfully.");
    res.redirect("/user/login"); // Redirect to login after password change
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};
