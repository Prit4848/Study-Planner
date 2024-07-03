const express = require("express")
const app = express();
const cookieparser = require("cookie-parser")
const path = require("path")
// const { reverse } = require("dns");
const session = require('express-session');
const flash = require('connect-flash');

require('dotenv').config();

const db = require("./config/mongoose-connection")
const userRoutes = require("./routes/userRouters")
const planRoutes = require("./routes/planRouters")
const goalRouter = require("./routes/goalRouter")
const indexRouter = require("./routes/indexRouter")

require('dotenv').config();
app.use(flash());

app.use(cookieparser());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.EXPRESS_SESSION_SECRET || '12345',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use(express.static('public'));


app.use('/user', userRoutes);
app.use('/plan', planRoutes);
app.use('/goal', goalRouter)
app.use('/',indexRouter);

app.listen(3000,()=>{
    console.log("servet started at port 3000")
})