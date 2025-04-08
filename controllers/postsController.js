
exports.allPosts = async (req, res) => {
    return res.status(200).json({success: true, message:'Hi from all post!'});
}

exports.singlePost = async (req, res) => {
    return res.status(200).json({success: true, message:'Hi from single post!'});
}

exports.createPost = async (req, res) => {
    return res.status(200).json({success: true, message:'Hi from create post!'});
}

exports.updatePost = async (req, res) => {
    return res.status(200).json({success: true, message:'Hi from update post!'});
}

exports.deletePost = async (req, res) => {
    return res.status(200).json({success: true, message:'Hi from delete post!'});
}