const User = require('../models/user');

module.exports.renderRegister = (req,res)=>{
    res.render('users/register');
};

module.exports.register = async(req,res,next)=>{
    try{
        const {username,email,password} = req.body;
        const user = new User({email,username});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser,err=>{
            if(err) return next(err);
        });
        console.log(registeredUser);
        req.flash('success','Welcome to The community!');
        res.redirect('/');
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