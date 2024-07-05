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

module.exports.viewGoal = async function(req,res){
  try{
    let goal = await goalModel.findOne({_id:req.params.goalid,userId:req.params.userid})

    res.render("viewGoal",{goal,user:req.user})
  }catch(err){
    res.send("err.message")
  }
}

module.exports.editGoal = async function(req,res){
  try{
    let goal = await goalModel.findOne({_id:req.params.goalid,userId:req.params.userid})

    res.render("editGoal",{goal,user:req.user})
  }catch(err){
    res.send("err.message")
  }
}

module.exports.postEditGoal = async function(req,res){
  try{
      let {goalTitle, goalDescription, dueDate, priority} = req.body;

      let goal = await goalModel.findOneAndUpdate({_id:req.params.goalid,userId:req.params.userid},{goalTitle, goalDescription, dueDate, priority},{new:true})

      await goal.save();

      res.redirect("/dashboard")
  }catch(err){
    res.send(err.message)
  }
}

module.exports.deleteGoal = async function(req,res){
  try{
       await goalModel.deleteOne({_id:req.params.goalid})

       res.redirect("/dashboard")
  }catch(err){
    res.send(err.message)
  }
}

module.exports.completionGoal = async function(req,res){
  try{
       let goal = await goalModel.findOne({_id:req.params.goalid})
       
        goal.completed = !goal.completed;
        
        await goal.save()
        res.redirect(`/goal/${goal._id}/${goal.userId}/view`)
  }catch(err){
    res.send(err.message);
  }
}