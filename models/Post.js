import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        trim: true,
        required: [true, 'Post must have content']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

export default mongoose.model('Post', postSchema)