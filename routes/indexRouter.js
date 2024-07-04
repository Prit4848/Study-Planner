const express = require("express");
const router = express.Router();
const isloggedin = require("../middleware/isLoggedin")
const planModel = require("../models/plan-model")
const userModel = require("../models/user-model")
const goalModel = require("../models/goal-model")


router.get("/",async function(req,res){
    let { email } = req.body;
    let error = req.flash("error");
    let user = await userModel.findOne({email:email})
    res.render("index",{ user,error,isloggedin:false });
    // res.send("hello brother")
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

module.exports = router;