const Blog = require('./models/blog');
const Comment = require('./models/comment');
const Event = require('./models/event');

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','You must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthorBlog = async(req,res,next)=>{
    const {id} = req.params;
    const blog = await Blog.findById(id);
    if(!blog.author.equals(req.user._id)){
        req.flash('error','You do not have the permission');
        return res.redirect(`/blog/${id}`);
    }
    next();
}

module.exports.isAuthorComment = async (req,res,next)=>{
    const {commentId} = req.params;
    const comment = await Comment.findById(commentId);
    if(!comment.author.equals(req.user._id)){
        req.flash('error','You do not have the permission');
        return res.redirect('/');
    }
    next();
}

module.exports.isAuthorEvent = async (req,res,next)=>{
    const {id} = req.params;
    const event = await Event.findById(id);
    if(!event.author.equals(req.user._id)){
        req.flash('error','You do not have the permission');
        return res.redirect(`/event/id`);
    }
    next();
}