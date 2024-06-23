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

        // res.status(200).json({
        //     status: "success",
        //     data: { post }
        // })
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

