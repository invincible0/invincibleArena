const Blog = require('../models/blog');
const User = require('../models/user');
const Comment = require('../models/comment');

module.exports.renderBlogs = async (req,res)=>{
    const blogs = await Blog.find({}).sort({date: 'descending'});
    res.render('blogs/index',{blogs});
}

module.exports.renderBlog = async (req,res)=>{
    const {id}= req.params;
    const blog = await Blog.findById(id).populate({
        path:'comments',
        populate:{
            path:'author'
        }
    }).populate('author');
    res.render('blogs/show',{blog});
}

module.exports.createBlogForm = (req,res)=>{
    res.render('blogs/new');
}

module.exports.createBlog = async (req,res)=>{
    const {title,body} = req.body;
    const blog = new Blog({title,body});
    blog.author = req.user._id;
    blog.date = Date.now();
    await blog.save();
    res.redirect('/blogs');
}

module.exports.createComment = async (req,res)=>{
    const blog = await Blog.findById(req.params.id);
    const {body}=req.body;
    const comment = new Comment({body});
    comment.author = req.user._id;
    comment.date = Date.now();
    blog.comments.push(comment);
    await comment.save();
    await blog.save();
    req.flash('success','Created new Comment');
    return res.redirect(`/blog/${req.params.id}`);
}

module.exports.voteComment = async (req,res)=>{
    const {id,commentId} = req.params;
    const user = await User.findById(req.user._id);
    var avail  = user.voted.includes(commentId.toString());
    if(!avail){
        const comment = await Comment.findById(commentId);
        user.voted.push(commentId.toString());
        await user.save();
        if(req.body.vote==="1"){
            comment.votes=comment.votes+1;
        }
        else{
            comment.votes--;
        }
        await comment.save();
    }
    else{
        req.flash('error','You have already voted for that comment');
    }
    res.redirect(`/blog/${id}`);
}
