const express = require("express")
const router = express.Router()

const planModel = require("../models/plan-model")
const isLoggedIn = require("../middleware/isLoggedin")
const {createPlans,postcreatePlans,postPlancheck,editPlan,posteditPlan,postTaskCompletion,postDelete,setReminder,attachment} = require("../controllers/planController")
const upload = require("../config/multer-config")

//create plan routs
router.get("/create/:userid",isLoggedIn,createPlans)
router.post("/create",upload.single("Attachment"),isLoggedIn,postcreatePlans)
router.get("/:planid/:userid",isLoggedIn,postPlancheck)

//edit plan routs
router.get("/:planid/:userid/edit",isLoggedIn,editPlan)
router.post("/:planid/:userid/edit",isLoggedIn,posteditPlan)

//task completion rout
router.post("/:planid/:taskid/toggle",isLoggedIn,postTaskCompletion)
router.post("/delete/:planid",isLoggedIn,postDelete)

// set reminder
router.post("/:planId/set-reminder",isLoggedIn,setReminder)

//show pdf
router.get("/:planId/attachment",attachment)

module.exports = router;