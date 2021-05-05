const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');

router.get('/login',(req,res)=>{
    res.render('users/login');
});

router.post('/login',passport.authenticate('local',{failureRedirect:'/login'}),(req,res)=>{
    res.redirect('/');
})

router.get('/register',(req,res)=>{
    res.render('users/register');
});

router.post('/register',async (req,res,next)=>{
    try{
        const {username,email,password} = req.body;
        const user = new User({email,username});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser,err=>{
            if(err) return next(err);
        })
        console.log(registeredUser);
        res.redirect('/');
    }catch (e){
        console.log(e);
        res.redirect('/register');
    }
   
})

router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
});

module.exports = router;