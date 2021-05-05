const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

const app = express();

const userRoutes = require('./routes/users');
const { getMaxListeners } = require('./models/user');

const port = process.env.PORT || 3000;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/minorProject';
const secret = process.env.SECRET || 'thisIsDummySecret';

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

// app.use(express.static(path.join(__dirname,'public')));

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
app.use(passport.initialize());
app.use(passport.session());//session should be used before this
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

// app.get('/fakeUser',async (req,res)=>{
//     const user = new User({email:'abbbbb@gmail.com',username:'abbb'});
//     const newUser = await User.register(user,'abcd');
//     res.send(newUser);
// })

app.use('/',userRoutes);

app.get('/',(req,res)=>{
    res.render('home');
})

app.listen(port,()=>{
    console.log(`Serving on ${port}`);
})