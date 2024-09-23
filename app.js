const express = require("express")
const app = express();
const cookieparser = require("cookie-parser")
const bodyParser = require("body-parser")
const path = require("path")
const session = require('express-session');
const flash = require('connect-flash');

require('dotenv').config();

const port = process.env.PORT

const db = require("./config/mongoose-connection")
const userRoutes = require("./routes/userRouters")
const planRoutes = require("./routes/planRouters")
const goalRouter = require("./routes/goalRouter")
const indexRouter = require("./routes/indexRouter")
const qrCodeRoute = require("./routes/qrCode")

require('dotenv').config();
app.use(flash());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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
app.use(express.static(path.join(__dirname, 'public')));


app.use('/user', userRoutes);
app.use('/plan', planRoutes);
app.use('/goal', goalRouter);
app.use('/api', qrCodeRoute);
app.use('/',indexRouter);

app.listen(port,()=>{
    console.log(`server started at port localhost:${port}`)
})