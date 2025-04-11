const Post = require('../models/postsModel');
const { createPostSchema } = require('../middlewares/postValidator');

exports.getPosts = async (req, res) => {
    const { page } = req.query;
    const postsPerPage = 10;

    try {
        let pageNum = 0;
        if (page <= 1) {
            pageNum = 0;
        }else{
            pageNum = page- 1;
        }

        const result = await Post.find()
                                    .sort({createdAt: -1})
                                    .skip(pageNum * postsPerPage)
                                    .limit(postsPerPage)
                                    .populate({
                                        path:'userId',
                                        select:'email'
                                    });

        return res.status(200).json({
            success: true,
            message: 'Posts fetch successfully',
            data: result
        });                                    
    } catch (error) {
        console.log("Error in get posts: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error"});
    }
}

exports.singlePost = async (req, res) => {
    const { _id } = req.query;
    try {
        const result = await Post.findOne({_id})
                            .populate({
                                path: 'userId',
                                select: 'email'
                            });
        return res.status(200).json({success: true, message: 'Get post successfully', data: result});

    } catch (error) {
        console.log('Error in single post: ', error);
        return res.status(500).json({success: false, message:'Ínternal Server Error'});
    }
}

exports.createPost = async (req, res) => {
    const { title, description } = req.body;
    const { userId } = req.user;
    try {
        const {error,  value} = createPostSchema.validate({
            title,
            description,
            userId
        });
        if (error) {
            return res.status(400)
                        .json({
                            success: false,
                            message: error.details[0].message
                        });
        }

        const result = await Post.create({
            title, description, userId
        });

        return res.status(201).json({
            success: true,
            message: 'Post has been created successfully!',
            data: result
        });
    } catch (error) {
        console.log("Error in create post: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error"});
    }

    return res.status(200).json({success: true, message:'Hi from create post!'});
}

exports.updatePost = async (req, res) => {
    const { _id } = req.query;
    const {title, description} = req.body;
    const { userId } = req.user;

    try {
        const { error, value} = createPostSchema.validate({
            title,
            description,
            userId,
        });
        if (error) {
            return res.status(401).json({success:false, message: error.details[0].message})
        }
        const existingPost = await Post.findOne({ _id });
        if (!existingPost) {
            return res.status(404).json({ success: false, message: 'Post unavaible'});
        }

        if (existingPost.userId.toString() !== userId) {
            return res.status(403)
                        .json({
                            success: false,
                            message: 'Unauthorized'
                        });
        }
        existingPost.title = title;
        existingPost.description = description;
        const result = await existingPost.save();
        return res.status(200)
                    .json({
                        success: false, message: 'Post has been updated successfully!',
                        data: result
                    });
    } catch (error) {
        
    }
}

exports.deletePost = async (req, res) => {
    const { _id } = req.query;

    try {
        
        const result = await Post.deleteOne({_id});
        if(result.deletedCount > 0){
            return res.status(200).json({success: true, message: 'Post has been deleted successfully'});
        }else{
            return res.
                    status(404)
                    .json({
                        success: false, 
                        message: 'Post not found. Possible reasons',
                        reasons:[
                            'The post may have been deleted',
                            'The _Id is incorrect or malformed',
                            'You don\'t have permission to view this post',
                        ],
                        action: 'Try checking the post Id or contact support',
                    });
        }


    } catch (error) {
        console.log("Error in delete post: ", error);
        res.status(500).json({ success: false, message: "Internal Server Error"});
    }
}