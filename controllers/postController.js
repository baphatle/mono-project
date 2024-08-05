import Post from '../models/Post.js'

// export const getAll = async (req, res) => {
//     try {
//         const posts = await Post.find({})
//             .populate('author', 'name')
//             .select('content createdAt')
//             .sort({ createdAt: -1 });
//         res.status(200).json({
//             status: "success",
//             result: posts.length,
//             data: { posts }
//         })
//     } catch (error) {
//         res.json({
//             name: error.name,
//             message: error.message
//         })
//     }
// }

export const getAll = async (req, res) => {
    try {
        const posts = await Post.find({})
            .populate('author', 'name') // Populate thông tin tác giả bài viết
            .populate({
                path: 'comments.author',
                select: 'name' // Populate thông tin người tạo comment
            })
            .select('content createdAt author likes comments') // Chỉ chọn các trường cụ thể
            .sort({ createdAt: -1 })
            .lean(); // Chuyển đổi sang plain JavaScript object để dễ dàng thao tác

        // Tính tổng số lượt like và chuẩn bị dữ liệu trả về
        const postsWithLikeCount = posts.map(post => ({
            ...post,
            likeCount: Array.isArray(post.likes) ? post.likes.length : 0, // Kiểm tra nếu post.likes là mảng
            comments: Array.isArray(post.comments) ? post.comments.map(comment => ({
                content: comment.content,
                author: comment.author.name,
                createdAt: comment.createdAt
            })) : [] // Kiểm tra nếu post.comments là mảng
        }));

        res.status(200).json({
            status: "success",
            result: posts.length,
            data: { posts: postsWithLikeCount }
        });
    } catch (error) {
        res.status(500).json({
            name: error.name,
            message: error.message
        });
    }
};


export const createOnePost = async (req, res, next) => {
    try {
        const { userId } = req.user
        const post = await Post.create({ ...req.body, author: userId })

        const posts = await Post.find({})
            // .populate('author', 'name')
            // .select('content createdAt')
            // .sort({ createdAt: -1 });
            .populate('author', 'name') // Populate thông tin tác giả bài viết
            .populate({
                path: 'comments.author',
                select: 'name' // Populate thông tin người tạo comment
            })
            .select('content createdAt author likes comments') // Chỉ chọn các trường cụ thể
            .sort({ createdAt: -1 })
            .lean(); // Chuyển đổi sang plain JavaScript object để dễ dàng thao tác
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

        // Trả về bài viết với số lượng likes cập nhật
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
            .populate({
                path: 'comments.author',
                select: 'name' // Populate tên người tạo comment
            })
            .exec();
        // res.status(200).json(post);
        const responsePost = {
            ...populatedPost.toObject(),
            comments: populatedPost.comments.map(comment => ({
                content: comment.content,
                author: comment.author.name, // Trả về tên người tạo comment
                createdAt: comment.createdAt,
                _id: comment._id
            })),
            likesCount: populatedPost.likes.length // Thay đổi nếu cần thiết
        };

        res.status(200).json(responsePost);
    } catch (error) {
        res.json({
            name: error.name,
            message: error.message
        })
    }
};

