const express = require("express");
const router = express.Router();
const isloggedin = require("../middleware/isLoggedin")
const planModel = require("../models/plan-model")
const userModel = require("../models/user-model")
const goalModel = require("../models/goal-model")
const {createGoal} = require("../controllers/goalController")

router.get("/",isloggedin,function(req,res){
    res.render("createGoal")
})

router.post("/create-goal",isloggedin,createGoal)
module.exports = router;