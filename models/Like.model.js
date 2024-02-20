const mongoose = require('mongoose');

const likeSchema = mongoose.Schema(
  {
    tweet: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Tweet',
      required: [true, 'Required field'],
    },
    tweetOwner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: [true, 'Required field'],
    },
    likingUser: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
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

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;