const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateTokens");
const planModel = require("../models/plan-model")
const userModel = require("../models/user-model")


// create plan routs
module.exports.createPlans =async function(req,res){
    try {
        const user = await userModel.findOne({ _id: req.params.userid});
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.render("createPlan", { user });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
}

module.exports.postcreatePlans = async function(req,res){
  try {
    const { title, description, date, tasks } = req.body;

    // Ensure tasks is defined and is an array
    if (!tasks || !Array.isArray(tasks)) {
        return res.status(400).send("Tasks are required and should be an array");
    }

    const plan = await planModel.create({
        userId: req.user._id,
        title,
        description,
        date,
        tasks: tasks.map((task) => ({
            title: task.title,
            description: task.description,
            startTime: task.startTime,
            endTime: task.endTime
        }))
    });

    await plan.save();
    res.render("viewPlan", { plan,user:req.user });
} catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
}
}

module.exports.postPlancheck =async function(req,res){
    try {
        const plan = await planModel.findOne({_id:req.params.planid,userId:req.params.userid});;
        if (!plan) {
            return res.status(404).send("Plan not found");
        }
        res.render("viewPlan", { plan, user: req.user });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
}

// edit plan routs

 module.exports.editPlan = async function(req,res){
   try{ let plan = await planModel.findOne({_id:req.params.planid,userId:req.params.userid})

    if(!plan) return res.status(404).send("plan are not found !")

    res.render("editplan",{plan,user:req.user})
     }catch(err){
        res.status(500).send("internal error !")
     }
 }

 module.exports.posteditPlan = async function(req, res) {
    try {
        const { title, description, date, tasks } = req.body;

        // Ensure tasks is defined and is an array
        if (!tasks || !Array.isArray(tasks)) {
            return res.status(400).send("Tasks are required and should be an array");
        }

        // Find the plan and update its fields
        const plan = await planModel.findOneAndUpdate(
            { _id: req.params.planid, userId: req.params.userid },
            { title, description, date, tasks },
            { new: true } // To return the updated document
        );

        if (!plan) {
            return res.status(404).send("Plan not found");
        }

        // Optionally, redirect to view the updated plan
        res.redirect("/plan/" + plan._id + "/" + plan.userId);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
};

//completion task rout

module.exports.postTaskCompletion = async function(req,res){
    try{

        let plan = await planModel.findOne({_id:req.params.planid})
        if(!plan){
            return res.status(404).send('Plan not found');
        }
        let task = plan.tasks.id(req.params.taskid);
        if (!task) {
            return res.status(404).send('Task not found');
          }
          task.completed = !task.completed;
          await plan.save();
          res.redirect("/plan/" + plan._id + "/" + plan.userId);
    }
    catch(err){
        console.error(err);
        res.status(500).send('Server error');
    }
}

// delete plan
module.exports.postDelete = async function(req, res) {
    try {
        // Delete the plan by ID
        await planModel.deleteOne({ _id: req.params.planid });

        // Redirect to the dashboard after deletion
        res.redirect('/dashboard'); // Adjust the path as necessary
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}