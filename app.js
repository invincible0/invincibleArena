if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const ExpressError = require('./utils/ExpressError');
const flash = require('connect-flash');
const cors = require('cors');

const app = express();

const userRoutes = require('./routes/users');

const port = process.env.PORT;
const dbUrl = process.env.DB_URL;
const secret = process.env.SECRET;

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));
app.use(cors());

const sessionConfig = {
    secret,
    resave:false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
};

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());//session should be used before this
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
}); 

app.use('/',userRoutes);

app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/secret',(req,res)=>{
    if(req.isAuthenticated()==false){
        res.send("you must be signed in");
    }
    res.send("here is the secret");
})

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404));
});

app.use((err,req,res,next)=>{
    const {statusCode=500}= err;
    if(!err.message) err.message = 'Something went Wrong';
    res.status(statusCode).render('error',{err});
})

app.listen(port,()=>{
    console.log(`Serving on ${port}`);
})