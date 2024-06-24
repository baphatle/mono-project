import Post from '../models/Post.js'

export const getAll = async (req, res) => {
    try {
        const posts = await Post.find({})
            .populate('author', 'name')
            .select('content createdAt')
            .sort({ createdAt: -1 });
        res.status(200).json({
            status: "success",
            result: posts.length,
            data: { posts }
        })
    } catch (error) {
        res.json({
            name: error.name,
            message: error.message
        })
    }
}


export const createOnePost = async (req, res, next) => {
    try {
        const { userId } = req.user
        const post = await Post.create({ ...req.body, author: userId })

        const posts = await Post.find({})
            .populate('author', 'name')
            .select('content createdAt')
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: "success",
            data: { post, allPosts: posts }
        });
    } catch (error) {
        res.json({
            name: error.name,
            message: error.message
        })
    }
}

export const updateOnePost = async (req, res, next) => {
    try {

        const { postId } = req.params;
        const post = await Post.findByIdAndUpdate(postId, { ...req.body }, { new: true, runValidator: true })
        res.status(200).json({
            status: "success",
            data: { post }
        })
    } catch (error) {
        res.json({
            name: error.name,
            message: error.message
        })
    }
}

export const deleteOnePost = async (req, res, next) => {
    try {

        const { postId } = req.params;
        await Post.findByIdAndDelete(postId)
        res.status(200).json({
            status: "success",
            message: "Post has been deleted!"
        })
    } catch (error) {
        res.json({
            name: error.name,
            message: error.message
        })
    }
}

export const likePost = async (req, res, next) => {
    const { postId } = req.params;
    const { userId } = req.user;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const isLiked = post.likes.includes(userId);
        if (isLiked) {
            // Nếu người dùng đã like, thì bỏ like
            post.likes = post.likes.filter(id => id.toString() !== userId);
        } else {
            // Nếu người dùng chưa like, thì thêm like
            post.likes.push(userId);
        }
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.json({
            name: error.name,
            message: error.message
        })
    }
};

export const commentPost = async (req, res, next) => {
    const { postId } = req.params;
    const { userId } = req.user;
    const { commentContent } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = {
            content: commentContent,
            author: userId,
            createdAt: new Date()
        };

        post.comments.push(newComment);
        await post.save();

        // Thực hiện truy vấn để populate author trong comments
        const populatedPost = await Post.findById(postId)
            .populate('comments.author', 'name')
            .exec();

        res.status(200).json(post);
    } catch (error) {
        res.json({
            name: error.name,
            message: error.message
        })
    }
};

