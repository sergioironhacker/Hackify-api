const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    chat: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Chat'
    },
    date: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        enum: ['read', 'unread'],
        default: 'unread'
    }
},
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = doc.id;
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }
})

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;