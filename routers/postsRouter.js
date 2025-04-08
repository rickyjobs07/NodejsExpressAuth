const express = require('express');
const postsController = require('../controllers/postsController');
const router = express.Router();

router.get('/all-posts', postsController.allPosts);
router.get('/single-post', postsController.singlePost);
router.post('/create-post', postsController.createPost);
router.put('/update-post', postsController.updatePost);
router.delete('/delete-post', postsController.deletePost);


module.exports = router;