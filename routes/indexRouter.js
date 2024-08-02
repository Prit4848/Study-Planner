const express = require("express");
const router = express.Router();
const isloggedin = require("../middleware/isLoggedin")
const planModel = require("../models/plan-model")
const userModel = require("../models/user-model")
const goalModel = require("../models/goal-model")


router.get("/",async function(req,res){
    let { email } = req.body;
    let error = req.flash("error");
    // let user = await userModel.findOne({email:email})
    res.render("index",{ error });
    // res.send("hello brother")
})
router.get("/home",isloggedin,function(req,res){
  
    res.render("home",{user:req.user})
 })

router.get("/dashboard", isloggedin,async function (req, res) {
    try {
        let plan = await planModel.find({ userId: req.user._id }); 

        let goal = await goalModel.find({userId:req.user._id})

        res.render("dashbord", { user: req.user, plan,goal });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
});

router.get("/Account/:userid",isloggedin,async function(req,res){
   let user = await userModel.findOne({_id:req.params.userid})
    res.render("Account",{user})
})

router.get("/Profile/:userid",isloggedin,async function(req,res){
    try{
        let plan = await planModel.find({userId:req.user._id})
        let goal = await goalModel.find({userId:req.user._id})
        res.render("profile",{user:req.user,plan,goal})
}catch(err){
    res.send(err.message)
    console.log(err)
}
})

router.get("/planTracker",isloggedin,async function(req,res){
    try{
        let plans = await planModel.find({userId:req.user._id})
       
        res.render("planTracker",{plans,user:req.user})
    }catch(err){
        res.send(err.messege);
    }
})

router.get("/h-oraganize-shedule",(req,res)=>{
    try{
         res.render("h_organize_shedule",{user:false})
    }catch(err){
        res.send(err.message)
        conasole.log(err)
    }
})

router.get("/h-oraganize-golal",(req,res)=>{
    try{
         res.render("h_organize_golas",{user:false})
    }catch(err){
        res.send(err.message)
        conasole.log(err)
    }
})

router.get("/h-personalize-alert",(req,res)=>{
    try{
         res.render("h_personalize_alert",{user:false})
    }catch(err){
        res.send(err.message)
        conasole.log(err)
    }
})

router.get("/h-tracking-progress",(req,res)=>{
    try{
         res.render("h_tracking_progress",{user:false})
    }catch(err){
        res.send(err.message)
        conasole.log(err)
    }
})

router.get("/contactUs",(req,res)=>{  // contact us get page
    try{
      res.render("contactUs",{user:false})
    }catch(err){
       res.send(err.message)
    }
})

router.get("/aboutUs",(req,res)=>{ //about us get page
    try{
      res.render("AboutUs",{user:false})
    }catch(err){
       res.send(err.message)
    }
})

router.get("/services",(req,res)=>{ //services get page
    try{
      res.render("services",{user:false})
    }catch(err){
       res.send(err.message)
    }
})

router.get("/whyUs",(req,res)=>{    // why us get page
    try{
      res.render("whyUs",{user:false})
    }catch(err){
       res.send(err.message)
    }
})

module.exports = router;