const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/login',(req,res)=>{
    res.render('users/login');
});

router.get('/register',(req,res)=>{
    res.render('users/register');
});
router.post('/register',async (req,res)=>{
    try{
        const {username,email,password} = req.body;
        const user = new User({email,username});
        const registeredUser = await User.register(user,password);
        console.log(registeredUser);
        res.redirect('/');
    }catch (e){
        console.log(e);
        res.redirect('/register');
    }
   
})

router.get('/logout',(req,res)=>{
    res.redirect('/');
});

module.exports = router;