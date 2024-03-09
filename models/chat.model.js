const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    users: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    }],
    messages: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Message'
    }],
    date: {
        type: Date,
        default: Date.now()
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

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
