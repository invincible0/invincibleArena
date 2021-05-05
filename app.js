const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();

const userRoutes = require('./routes/users');

const port = process.env.PORT || 3000;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/minorProject';
const secret = process.env.SECRET || 'thisIsDummySecret';

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

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
})

app.listen(port,()=>{
    console.log(`Serving on ${port}`);
})