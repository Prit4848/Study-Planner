const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateTokens");
const planModel = require("../models/plan-model")
const userModel = require("../models/user-model")
const twilio = require('twilio');
const cron = require('node-cron');

const accountSid = process.env.SID; 
const authToken = process.env.SID_TOKEN; 
const client = new twilio(accountSid, authToken);

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
        
        
        const user = await userModel.findOne({_id:req.user})
        
        if (!user) {
          return res.status(404).send("User not found");
        }
    
        const today = new Date();
        const todayDateString = today.toDateString();
        const lastPlanDateString = user.lastPlanDate ? user.lastPlanDate.toDateString() : null;
    
        if (lastPlanDateString === todayDateString) {
          // User has already created a plan today
          return res.redirect('/dashboard');
        }
    
        if (lastPlanDateString && new Date(lastPlanDateString).getTime() === (new Date(today).getTime() - 86400000)) {
          user.streak += 1; // Increment streak if the last plan was created yesterday
        } else {
          user.streak = 1; // Reset streak if not consecutive days
        }
    
        user.lastPlanDate = today;
    
        // Ensure tasks is defined and is an array
        if (!tasks || !Array.isArray(tasks)) {
            return res.status(400).send("Tasks are required and should be an array");
        }
    
        const plan = await planModel.create({
            userId: user._id,
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
        await user.save();
        res.render("viewPlan", { plan, user });
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

// set reminder

module.exports.setReminder = async function(req,res){
    const {reminderDate} = req.body;
    const phone_no = req.user.phone_no;
    const userId = req.user._id
    const planId = req.params.planId
    try{
      let plan = await planModel.findOne({_id:req.params.planId})

      const reminderDateObj = new Date(reminderDate);
      const tasksInfo = plan.tasks.map(task => `${task.title} (${task.startTime} - ${task.endTime})`).join(', ');
      const messageBody = `Reminder for your plan: ${plan.title} - ${plan.description}. Tasks: ${tasksInfo}`;

    console.log(messageBody)

    // Schedule the WhatsApp message
    const job = cron.schedule(
      `${reminderDateObj.getUTCSeconds()} ${reminderDateObj.getUTCMinutes()} ${reminderDateObj.getUTCHours()} ${reminderDateObj.getUTCDate()} ${reminderDateObj.getUTCMonth() + 1} *`,
      () => {
        client.messages.create({
          body: messageBody,
          from: 'whatsapp:+14155238886', // Your Twilio WhatsApp number
          to: `whatsapp:+91${phone_no}`
        })
        .then(message => {
          console.log(`Message sent: ${message.sid} : ${message.to}`);
          
        })
        .catch(err => {
          console.error('Failed to send WhatsApp message', err);
        });
      },
      {
        timezone: 'UTC'
      }
    );

    // Save the scheduled job for later reference if needed
    plan.reminderJobId = job.id;
    console.log(plan.reminderJobId)
    await plan.save();
    
    res.redirect(`/plan/${planId}/${userId}`);
    }catch(err){
        res.send(err.messege)
        console.log(err)
    }
}