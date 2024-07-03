const express = require("express");
const router = express.Router();
const isloggedin = require("../middleware/isLoggedin")
const planModel = require("../models/plan-model")
const userModel = require("../models/user-model")
const goalModel = require("../models/goal-model")

router.get("/",function(req,res){
    res.render("createGoal")
})

module.exports = router;