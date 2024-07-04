const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateTokens");
const planModel = require("../models/plan-model");
const userModel = require("../models/user-model");
const goalModel = require("../models/goal-model");

module.exports.createGoal = async function (req, res) {
  try {
    let { userId, goalTitle, goalDescription, dueDate, priority } = req.body;

   let goal = await goalModel.create({
        userId:req.user._id,
        goalTitle,
        goalDescription,
        dueDate,
        priority
    })

  await goal.save();
  res.redirect("/dashboard")
  } catch (err) {
    res.send(err.message);
    console.log(err);
  }
};
