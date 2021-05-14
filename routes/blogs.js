const express = require('express');
const router = express.Router();
const blogs = require('../controllers/blogs');
const {isLoggedIn} = require('../middleware');

router.get('/blogs',blogs.renderBlogs);
router.get('/blog/new',isLoggedIn,blogs.createBlogForm);
router.get('/blog/:id',blogs.renderBlog);
router.post('/blog/new',isLoggedIn,blogs.createBlog);
router.post('/blog/:id',isLoggedIn,blogs.createComment);
router.post('/blog/:id/:commentId',isLoggedIn,blogs.voteComment);

module.exports = router;