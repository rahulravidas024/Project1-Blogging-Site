const express = require('express');
const router = express.Router();
const middleware = require('../middleware/auth')
const authorController = require('../controller/authorController')
const blogController = require('../controller/blogController')

router.post('/authors', authorController.createAuthor)

router.post('/blogs', middleware.authentication, blogController.createBlogs)

router.get('/blogs', middleware.authentication, blogController.getBlog)

router.put('/blogs/:blogId', middleware.authentication, middleware.authorization, blogController.updateBlogs)

router.delete('/blogs/:blogId', middleware.authentication, middleware.authorization, blogController.deleteBlog)

router.delete('/blogs', middleware.authentication, blogController.deleteByQuery)

router.post('/login', authorController.loginUser)

module.exports = router;
