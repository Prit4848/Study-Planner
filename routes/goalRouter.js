const express = require("express");
const router = express.Router();
const isloggedin = require("../middleware/isLoggedin")
const planModel = require("../models/plan-model")
const userModel = require("../models/user-model")
const goalModel = require("../models/goal-model")
const {createGoal,viewGoal,editGoal,postEditGoal,deleteGoal} = require("../controllers/goalController")

router.get("/",isloggedin,function(req,res){
    res.render("createGoal")
})

router.post("/create-goal",isloggedin,createGoal)
router.get("/:goalid/:userid/view",isloggedin,viewGoal)
router.get("/:goalid/:userid/edit",isloggedin,editGoal)
router.post("/:goalid/:userid/edit",isloggedin,postEditGoal)
router.post("/delete/:goalid",deleteGoal)
module.exports = router;