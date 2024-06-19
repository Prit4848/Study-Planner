const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedin")
const planModel = require("../models/plan-model")
const userModel = require("../models/user-model")


router.get("/",async function(req,res){
    let { email } = req.body;
    let error = req.flash("error");
    let user = await userModel.findOne({email:email})
    res.render("index",{ user,error });
    // res.send("hello brother")
})

router.get("/dashboard", isLoggedIn,async function (req, res) {
    try {
        let plan = await planModel.find({ userId: req.user._id }); 
        res.render("dashbord", { user: req.user, plan });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
});


module.exports = router;