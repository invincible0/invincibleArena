const User = require('../models/user');
const jwt = require('jsonwebtoken');
const mailgun = require('mailgun-js');
const DOMAIN = process.env.DOMAIN;
const mg = mailgun({apiKey: process.env.API_KEY,domain:DOMAIN});

module.exports.renderRegister = (req,res)=>{
    res.render('users/register');
};

module.exports.register = async(req,res,next)=>{
    try{
        const {username,email} = req.body;

        const user1=await User.findOne({username: username.trim()});
        const user2=await User.findOne({email : email.trim()});

        if(user1 && user2){
            req.flash('error','User with this username and email already exists');
            return res.redirect('/register');
        }
        if(user1){
            req.flash('error','User with this username already exists');
            return res.redirect('/register');
        }
        if(user2){
            req.flash('error','User with this email already exists');
            return res.redirect('/register');
        }
        
        const token = jwt.sign({username,email},process.env.SECRET,{expiresIn: '20m'});
        const data = {
            from:'noreply@invinciblearena.com',
            to:email,
            subject: 'Account Activation Link',
            html: `
                <h2>Please Click on the given Link to activate you InvincibleArena Account</p>
                <a href="http://localhost:3000/auth/${token}">Click Here</a>
            `
        };
        mg.messages().send(data, function (error, body) {
            if(error){
                console.log(err.message);
                req.flash('error','Please try again later');
                return res.redirect('/register');
            }
            req.flash('success','Verification Link sent on you mail');
            return res.redirect('/');
        });

    }catch (e){
        console.log(e);
        req.flash('error','Error');
        res.redirect('/register');
    }
};

module.exports.renderLogin = (req,res)=>{
    res.render('users/login');
};

module.exports.login = (req,res)=>{
    req.flash('success','Welcome Back!');
    res.redirect('/');
}

module.exports.logout = (req,res)=>{
    req.logout();
    req.flash('success','Successfully Logged out');
    res.redirect('/');
};

module.exports.auth = async (req,res,next)=>{
    const {token}=req.body;
    if(!token){
        req.flash('error','Token not provided');
        return res.redirect('/register');
    }
    jwt.verify(token,process.env.SECRET,async function(err,decodedToken){
        if(err){
            req.flash('error','Invalid or Expired Token');
            res.redirect('/register');
        }
        const {username,email}=decodedToken;
        const {fullname,password}=req.body;

        const user1=await User.findOne({username: username.trim()});
        const user2=await User.findOne({email : email.trim()});

        if(user1 && user2){
            req.flash('error','User with this username and email already exists');
            return res.redirect('/register');
        }
        if(user1){
            req.flash('error','User with this username already exists');
            return res.redirect('/register');
        }
        if(user2){
            req.flash('error','User with this email already exists');
            return res.redirect('/register');
        }

        try{
            const user= new User({email,username,fullname});
            const registeredUser = await User.register(user,password);
            req.login(registeredUser,err=>{
                if(err){
                    return next(err);
                }
            });
            req.flash('success','Welcome to the Community!');
            return res.redirect('/');
        }catch(e){
            console.log(e);
            req.flash('error','Error occurred');
            return res.redirect('/register');
        }
    })
}

module.exports.renderAuth = (req,res)=>{
    const {token}=req.params;
    if(!token){
        req.flash('error','No token provided');
        return res.redirect('/register');
    }
    jwt.verify(token,process.env.SECRET,function(err,decodedToken){
        if(err){
            req.flash('error','Invalid or expired token');
            return res.redirect('/register');
        }
        return res.render('users/auth',{token:token});
    })
    req.flash('error','Something went wrong');
    return res.redirect('/');
}