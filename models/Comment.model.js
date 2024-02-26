const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Required field'],
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: [true, 'Required field'],
    },
    idea: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Idea',
      required: [true, 'Required field'],
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        // Sirve para cambiar el output de los endpoints cuando hago res.json
        ret.id = ret._id;
        delete ret.__v;
        delete ret._id;
      },
    },
  }
)

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;