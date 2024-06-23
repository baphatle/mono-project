import mongoose from 'mongoose'

// const postSchema = new mongoose.Schema({
//     content: {
//         type: String,
//         trim: true,
//         required: [true, 'Post must have content']
//     },
//     author: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     }
// }, { timestamps: true })

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        trim: true,
        required: [true, 'Post must have content']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        content: {
            type: String,
            trim: true,
            required: [true, 'Comment must have content']
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true })

export default mongoose.model('Post', postSchema)