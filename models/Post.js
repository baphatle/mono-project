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
        ref: 'User',
        default: []
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

postSchema.virtual('likesCount').get(function () {
    return this.likes.length;
});

postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });


export default mongoose.model('Post', postSchema)